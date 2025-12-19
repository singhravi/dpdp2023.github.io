'use strict';

/**
 * DPDP Act 2023 Interactive Learning Platform
 * Main JavaScript Module
 */

// ===== CONSTANTS =====
const TOTAL_ASSESSMENT_QUESTIONS = 10;
const PASSING_SCORE_PERCENTAGE = 70;
const ANIMATION_DELAY = 50; // ms for forced reflow

// Assessment answer key
const ASSESSMENT_ANSWERS = {
    q1: 'b', 
    q2: 'c', 
    q3: 'b', 
    q4: 'b', 
    q5: 'c',
    q6: 'b', 
    q7: 'a', 
    q8: 'b', 
    q9: 'b', 
    q10: 'b'
};

// Exemptions exercise answers
const EXEMPTIONS_ANSWERS = {
    ex5a: '17(1)(c)',
    ex5b: '17(2)(b)',
    ex5c: '17(1)(f)'
};

// ===== DOM CACHE =====
let domCache = {};

/**
 * Cache frequently accessed DOM elements
 */
function initDOMCache() {
    try {
        domCache = {
            stickyProgress: document.getElementById('sticky-progress'),
            progressBar: document.getElementById('progress'),
            progressLabel: document.getElementById('progress-label'),
            assessmentForm: document.getElementById('final-assessment'),
            finalResult: document.getElementById('final-result'),
            contentSections: document.querySelectorAll('.content-section'),
            tabButtons: document.querySelectorAll('.tab-btn')
        };
    } catch (error) {
        console.error('Error initializing DOM cache:', error);
    }
}

// ===== TAB NAVIGATION =====
/**
 * Switch between content tabs
 * @param {string} tabId - ID of the tab to show
 */
function showTab(tabId) {
    try {
        // Remove active class from all sections and buttons
        domCache.contentSections.forEach(section => section.classList.remove('active'));
        domCache.tabButtons.forEach(button => button.classList.remove('active'));
        
        // Add active class to selected tab and button
        const targetSection = document.getElementById(tabId);
        const targetButton = document.querySelector(`[data-tab="${tabId}"]`);
        
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        if (targetButton) {
            targetButton.classList.add('active');
        }
        
        // Toggle sticky progress bar
        toggleStickyProgressBar(tabId);
        
    } catch (error) {
        console.error('Error switching tabs:', error);
    }
}

/**
 * Show/hide sticky progress bar based on active tab
 * @param {string} tabId - Current active tab ID
 */
function toggleStickyProgressBar(tabId) {
    if (!domCache.stickyProgress) return;
    
    try {
        if (tabId === 'assessment') {
            domCache.stickyProgress.style.display = 'block';
            updateProgressBar();
        } else {
            domCache.stickyProgress.style.display = 'none';
        }
    } catch (error) {
        console.error('Error toggling progress bar:', error);
    }
}

// ===== PROGRESS BAR =====
/**
 * Update progress bar based on answered questions
 */
function updateProgressBar() {
    if (!domCache.assessmentForm || !domCache.progressBar || !domCache.progressLabel) {
        return;
    }
    
    try {
        let answeredCount = 0;
        
        // Count answered questions
        for (let i = 1; i <= TOTAL_ASSESSMENT_QUESTIONS; i++) {
            const questionName = `q${i}`;
            const selected = domCache.assessmentForm.querySelector(
                `input[name="${questionName}"]:checked`
            );
            if (selected) {
                answeredCount++;
            }
        }
        
        const percentage = Math.round((answeredCount / TOTAL_ASSESSMENT_QUESTIONS) * 100);
        
        // Update progress bar
        domCache.progressBar.style.width = `${percentage}%`;
        domCache.progressBar.setAttribute('aria-valuenow', percentage);
        
        // Update label
        domCache.progressLabel.textContent = 
            `${answeredCount}/${TOTAL_ASSESSMENT_QUESTIONS} (${percentage}%)`;
        
    } catch (error) {
        console.error('Error updating progress bar:', error);
    }
}

// ===== EXERCISE ANSWER CHECKING =====
/**
 * Show hidden element (for exercise answers)
 * @param {string} elementId - ID of element to show
 */
function showElement(elementId) {
    try {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('show');
        } else {
            console.warn(`Element with ID '${elementId}' not found`);
        }
    } catch (error) {
        console.error('Error showing element:', error);
    }
}

/**
 * Check answer for multiple choice exercises
 * @param {string} questionName - Name attribute of the question
 * @param {string} correctAnswer - Correct answer value
 * @param {string} resultId - ID of result div
 */
function checkAnswer(questionName, correctAnswer, resultId) {
    try {
        const selected = document.querySelector(`input[name="${questionName}"]:checked`);
        const resultDiv = document.getElementById(resultId);
        
        if (!selected) {
            alert('Please select an answer first!');
            return;
        }
        
        if (!resultDiv) {
            console.error(`Result div '${resultId}' not found`);
            return;
        }
        
        // Update result display
        if (selected.value === correctAnswer) {
            resultDiv.classList.remove('wrong-answer');
        } else {
            resultDiv.classList.add('wrong-answer');
        }
        
        resultDiv.classList.add('show');
        
    } catch (error) {
        console.error('Error checking answer:', error);
    }
}

/**
 * Check exemptions exercise (Exercise 5)
 */
function checkExemptions() {
    try {
        const resultDiv = document.getElementById('ex5-result');
        if (!resultDiv) {
            console.error('Result div not found');
            return;
        }
        
        let html = '<strong>Results:</strong><br><br>';
        
        // Check Scenario A
        const answerA = document.getElementById('ex5a')?.value;
        if (answerA === EXEMPTIONS_ANSWERS.ex5a) {
            html += '<p>✅ <strong>Scenario A: Correct!</strong> Section 17(1)(c) - Law enforcement exemption applies for crime investigation.</p>';
        } else {
            html += '<p>❌ <strong>Scenario A:</strong> Correct answer is Section 17(1)(c) - Processing for prevention, detection, investigation or prosecution of offenses.</p>';
        }
        
        // Check Scenario B
        const answerB = document.getElementById('ex5b')?.value;
        if (answerB === EXEMPTIONS_ANSWERS.ex5b) {
            html += '<p>✅ <strong>Scenario B: Correct!</strong> Section 17(2)(b) - Research with anonymized data and prescribed standards.</p>';
        } else {
            html += '<p>❌ <strong>Scenario B:</strong> Correct answer is Section 17(2)(b) - Processing for research/archiving/statistics (not used for specific decisions, follows standards).</p>';
        }
        
        // Check Scenario C
        const answerC = document.getElementById('ex5c')?.value;
        if (answerC === EXEMPTIONS_ANSWERS.ex5c) {
            html += '<p>✅ <strong>Scenario C: Correct!</strong> Section 17(1)(f) - Specific exemption for loan default cases.</p>';
        } else {
            html += '<p>❌ <strong>Scenario C:</strong> Correct answer is Section 17(1)(f) - Ascertaining financial information of loan defaulters from financial institutions.</p>';
        }
        
        resultDiv.innerHTML = html;
        resultDiv.classList.add('show');
        
    } catch (error) {
        console.error('Error checking exemptions:', error);
    }
}

// ===== FINAL ASSESSMENT =====
/**
 * Calculate score for a section of questions
 * @param {string} prefix - Question name prefix (e.g., 'q')
 * @param {number} start - Start question number
 * @param {number} end - End question number
 * @returns {number} Score for the section
 */
function calculateSectionScore(prefix, start, end) {
    let score = 0;
    
    try {
        for (let i = start; i <= end; i++) {
            const questionName = `${prefix}${i}`;
            const selected = document.querySelector(`input[name="${questionName}"]:checked`);
            
            if (selected && selected.value === ASSESSMENT_ANSWERS[questionName]) {
                score++;
            }
        }
    } catch (error) {
        console.error(`Error calculating section score (${prefix}${start}-${end}):`, error);
    }
    
    return score;
}

/**
 * Get grade and message based on percentage
 * @param {number} percentage - Score percentage
 * @returns {Object} Grade information
 */
function getGradeInfo(percentage) {
    if (percentage >= 90) {
        return {
            grade: 'Outstanding',
            message: '🏆 Excellent! You have mastered the DPDP Act 2023!',
            className: 'result-outstanding'
        };
    } else if (percentage >= 80) {
        return {
            grade: 'Very Good',
            message: '🌟 Great job! Strong understanding of the Act!',
            className: 'result-very-good'
        };
    } else if (percentage >= PASSING_SCORE_PERCENTAGE) {
        return {
            grade: 'Good - Pass',
            message: '👍 Good! You have passed the assessment!',
            className: 'result-pass'
        };
    } else if (percentage >= 60) {
        return {
            grade: 'Fair',
            message: '📚 Close! Review the materials and try again.',
            className: 'result-fair'
        };
    } else {
        return {
            grade: 'Needs Improvement',
            message: '📖 Please review the training materials carefully.',
            className: 'result-fail'
        };
    }
}

/**
 * Submit and grade the final assessment
 */
function submitFinalAssessment() {
    if (!domCache.assessmentForm || !domCache.finalResult) {
        console.error('Assessment form or result div not found');
        return;
    }
    
    try {
        let score = 0;
        let unanswered = 0;
        
        // Calculate score and check for unanswered questions
        for (const [questionName, correctAnswer] of Object.entries(ASSESSMENT_ANSWERS)) {
            const selected = domCache.assessmentForm.querySelector(
                `input[name="${questionName}"]:checked`
            );
            
            if (!selected) {
                unanswered++;
            } else if (selected.value === correctAnswer) {
                score++;
            }
        }
        
        // Alert if there are unanswered questions
        if (unanswered > 0) {
            alert(`You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Please answer all questions.`);
            return;
        }
        
        const percentage = Math.round((score / TOTAL_ASSESSMENT_QUESTIONS) * 100);
        const gradeInfo = getGradeInfo(percentage);
        
        // Update progress bar to show completion
        if (domCache.progressBar) {
            domCache.progressBar.style.width = '100%';
            domCache.progressBar.setAttribute('aria-valuenow', '100');
        }
        
        if (domCache.progressLabel) {
            domCache.progressLabel.textContent = 
                `${score}/${TOTAL_ASSESSMENT_QUESTIONS} Correct (${percentage}%)`;
        }
        
        // Calculate section score
        const preliminaryScore = calculateSectionScore('q', 1, 10);
        
        // Display results
        domCache.finalResult.className = `result show ${gradeInfo.className}`;
        domCache.finalResult.innerHTML = `
            <h2>${gradeInfo.grade}</h2>
            <h3>Score: ${score}/${TOTAL_ASSESSMENT_QUESTIONS} (${percentage}%)</h3>
            <p class="result-message">${gradeInfo.message}</p>
            <div class="performance-breakdown">
                <h4>Performance Breakdown:</h4>
                <p>Section A (Preliminary): ${preliminaryScore} / 10</p>
            </div>
            ${percentage >= PASSING_SCORE_PERCENTAGE ? 
                '<div class="certificate-notice"><strong>🎓 Certificate Eligible!</strong><br>You have successfully completed the DPDP Act 2023 training assessment.</div>' 
                : 
                '<div class="recommended-action"><strong>📚 Recommended Action:</strong><br>Review the materials and retake assessment.</div>'
            }
        `;
        
        // Scroll to results
        domCache.finalResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Error submitting assessment:', error);
        alert('An error occurred while submitting your assessment. Please try again.');
    }
}

/**
 * Reset the assessment form and results
 */
function resetAssessment() {
    if (!domCache.assessmentForm || !domCache.finalResult) {
        console.error('Assessment form or result div not found');
        return;
    }
    
    try {
        // Reset form
        domCache.assessmentForm.reset();
        
        // Hide results
        domCache.finalResult.classList.remove('show');
        domCache.finalResult.className = 'result';
        
        // Reset progress bar
        if (domCache.progressBar) {
            domCache.progressBar.style.width = '0%';
            domCache.progressBar.setAttribute('aria-valuenow', '0');
        }
        
        if (domCache.progressLabel) {
            domCache.progressLabel.textContent = `0/${TOTAL_ASSESSMENT_QUESTIONS} (0%)`;
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error resetting assessment:', error);
    }
}

// ===== EVENT DELEGATION =====
/**
 * Handle button clicks using event delegation
 * @param {Event} event - Click event
 */
function handleButtonClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    
    const action = button.dataset.action;
    
    switch (action) {
        case 'check-answer':
            checkAnswer(
                button.dataset.question,
                button.dataset.answer,
                button.dataset.result
            );
            break;
            
        case 'show-element':
            showElement(button.dataset.target);
            break;
            
        case 'check-exemptions':
            checkExemptions();
            break;
            
        case 'submit-assessment':
            submitFinalAssessment();
            break;
            
        case 'reset-assessment':
            resetAssessment();
            break;
            
        default:
            console.warn(`Unknown action: ${action}`);
    }
}

/**
 * Handle tab button clicks
 * @param {Event} event - Click event
 */
function handleTabClick(event) {
    const tabButton = event.target.closest('[data-tab]');
    if (!tabButton) return;
    
    const tabId = tabButton.dataset.tab;
    showTab(tabId);
}

// ===== INITIALIZATION =====
/**
 * Initialize the application
 */
function init() {
    try {
        // Initialize DOM cache
        initDOMCache();
        
        // Set up event delegation for all buttons
        document.addEventListener('click', handleButtonClick);
        
        // Set up tab navigation
        const navTabs = document.querySelector('.nav-tabs');
        if (navTabs) {
            navTabs.addEventListener('click', handleTabClick);
        }
        
        // Set up live progress tracking on assessment form
        if (domCache.assessmentForm) {
            domCache.assessmentForm.addEventListener('change', (event) => {
                if (event.target.type === 'radio') {
                    updateProgressBar();
                }
            });
        }
        
        // Initial progress bar state
        toggleStickyProgressBar('exercises'); // Default tab
        
        console.log('DPDP Act 2023 Platform initialized successfully');
        
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
