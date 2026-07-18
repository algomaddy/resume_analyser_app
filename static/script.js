const fileInput = document.getElementById('file');
const fileDropArea = document.querySelector('.file-drop-area');
const fileMsg = document.querySelector('.file-msg');
const form = document.getElementById('analyze-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.querySelector('.btn-text');
const spinner = document.querySelector('.spinner');
const resultsSection = document.getElementById('results-section');

// File upload UI logic
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, () => fileDropArea.classList.add('is-active'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, () => fileDropArea.classList.remove('is-active'), false);
});

fileDropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    fileInput.files = files;
    updateFileDisplay();
}

fileInput.addEventListener('change', updateFileDisplay);

function updateFileDisplay() {
    if (fileInput.files.length > 0) {
        fileMsg.textContent = fileInput.files[0].name;
        fileDropArea.style.borderColor = 'var(--success)';
    } else {
        fileMsg.textContent = 'Drag & drop or click to upload PDF';
        fileDropArea.style.borderColor = 'var(--border)';
    }
}

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!fileInput.files.length) {
        alert("Please select a PDF file.");
        return;
    }

    // UI Loading state
    submitBtn.disabled = true;
    btnText.textContent = "Analyzing...";
    spinner.classList.remove('hidden');
    resultsSection.classList.add('hidden');

    const formData = new FormData(form);

    try {
        const response = await fetch('/analyze-resume', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            let errorMsg = "An error occurred during analysis.";
            try {
                const errData = await response.json();
                errorMsg = errData.detail || errorMsg;
            } catch (e) {}
            throw new Error(errorMsg);
        }

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = "Analyze Candidate";
        spinner.classList.add('hidden');
    }
});

function displayResults(data) {
    // 1. Update Match Score
    const score = data.match_score;
    const scorePath = document.getElementById('score-circle-path');
    const scoreText = document.getElementById('score-text');
    
    scorePath.setAttribute('stroke-dasharray', `${score}, 100`);
    scoreText.textContent = `${score}%`;
    
    // Color logic based on score
    let strokeColor = 'var(--danger)';
    if (score >= 70) strokeColor = 'var(--success)';
    else if (score >= 40) strokeColor = '#f59e0b'; // warning yellow
    
    scorePath.style.stroke = strokeColor;
    scoreText.style.fill = strokeColor;

    // 2. Update Experience
    document.getElementById('exp-text').textContent = `${data.years_of_experience} years`;

    // 3. Update Skills
    const skillsContainer = document.getElementById('skills-tags');
    skillsContainer.innerHTML = '';
    if (data.skills && data.skills.length > 0) {
        data.skills.forEach(skill => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = skill;
            skillsContainer.appendChild(span);
        });
    } else {
        skillsContainer.innerHTML = '<p style="color: var(--text-secondary)">No skills identified.</p>';
    }

    // 4. Update Missing Requirements
    const missingList = document.getElementById('missing-list');
    missingList.innerHTML = '';
    if (data.missing_requirements && data.missing_requirements.length > 0) {
        data.missing_requirements.forEach(req => {
            const li = document.createElement('li');
            li.textContent = req;
            missingList.appendChild(li);
        });
    } else {
        missingList.innerHTML = '<p style="color: var(--success); font-weight: 500;">✓ Candidate meets all critical requirements.</p>';
    }

    // Show results with smooth transition
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
