// Modal and Calculator Display Functions
function showCalculator(calcType) {
    const modal = document.getElementById('calculator-modal');
    const allCalcs = document.querySelectorAll('.calc-content');
    
    // Hide all calculators
    allCalcs.forEach(calc => calc.classList.remove('active'));
    
    // Show selected calculator
    const selectedCalc = document.getElementById(calcType + '-calc');
    if (selectedCalc) {
        selectedCalc.classList.add('active');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCalculator() {
    const modal = document.getElementById('calculator-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('calculator-modal');
    if (event.target == modal) {
        closeCalculator();
    }
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Calculator Functions

// 1. Miter Angle Calculator
function calculateMiter() {
    const sides = parseFloat(document.getElementById('miter-sides').value);
    
    if (!sides || sides < 3) {
        showResult('miter-result', '<p style="color: red;">Please enter a valid number of sides (3 or more)</p>');
        return;
    }
    
    const miterAngle = (180 - (360 / sides)) / 2;
    const sawAngle = 90 - miterAngle;
    
    const resultHTML = `
        <h3>Results:</h3>
        <p><strong>Miter Angle:</strong> ${miterAngle.toFixed(2)}°</p>
        <p><strong>Saw Setting:</strong> ${sawAngle.toFixed(2)}°</p>
        <p><strong>Corner Angle:</strong> ${(360 / sides).toFixed(2)}°</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 0.9rem; color: #666;">For a ${sides}-sided project, set your miter saw to ${sawAngle.toFixed(2)}°</p>
    `;
    
    showResult('miter-result', resultHTML);
}

// 2. Compound Miter Calculator
function calculateCompound() {
    const cornerAngle = parseFloat(document.getElementById('compound-corner').value);
    const slopeAngle = parseFloat(document.getElementById('compound-slope').value);
    
    if (!cornerAngle || !slopeAngle) {
        showResult('compound-result', '<p style="color: red;">Please enter both angles</p>');
        return;
    }
    
    // Convert to radians
    const cornerRad = (cornerAngle / 2) * (Math.PI / 180);
    const slopeRad = slopeAngle * (Math.PI / 180);
    
    // Calculate compound angles
    const miterAngle = Math.atan(Math.cos(slopeRad) * Math.tan(cornerRad)) * (180 / Math.PI);
    const bevelAngle = Math.asin(Math.sin(slopeRad) * Math.sin(cornerRad)) * (180 / Math.PI);
    
    const resultHTML = `
        <h3>Results:</h3>
        <p><strong>Miter Angle:</strong> ${miterAngle.toFixed(2)}°</p>
        <p><strong>Bevel Angle:</strong> ${bevelAngle.toFixed(2)}°</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 0.9rem; color: #666;">Set your saw to these angles for compound cuts at ${cornerAngle}° corners with ${slopeAngle}° slope</p>
    `;
    
    showResult('compound-result', resultHTML);
}

// 3. Board Feet Calculator
function calculateBoardFeet() {
    const thickness = parseFloat(document.getElementById('board-thickness').value);
    const width = parseFloat(document.getElementById('board-width').value);
    const length = parseFloat(document.getElementById('board-length').value);
    const quantity = parseFloat(document.getElementById('board-quantity').value) || 1;
    const price = parseFloat(document.getElementById('board-price').value) || 0;
    
    if (!thickness || !width || !length) {
        showResult('board-result', '<p style="color: red;">Please enter thickness, width, and length</p>');
        return;
    }
    
    // Board feet formula: (Thickness in inches × Width in inches × Length in feet) / 12
    const boardFeetPerPiece = (thickness * width * length) / 12;
    const totalBoardFeet = boardFeetPerPiece * quantity;
    const totalCost = totalBoardFeet * price;
    
    let resultHTML = `
        <h3>Results:</h3>
        <p><strong>Board Feet per Piece:</strong> ${boardFeetPerPiece.toFixed(3)} BF</p>
        <p><strong>Total Board Feet:</strong> ${totalBoardFeet.toFixed(3)} BF</p>
    `;
    
    if (price > 0) {
        resultHTML += `
            <p><strong>Cost per Piece:</strong> $${(boardFeetPerPiece * price).toFixed(2)}</p>
            <p><strong>Total Cost:</strong> $${totalCost.toFixed(2)}</p>
        `;
    }
    
    resultHTML += `
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 0.9rem; color: #666;">Based on ${quantity} piece(s) at ${thickness}" × ${width}" × ${length}'</p>
    `;
    
    showResult('board-result', resultHTML);
}

// 4. Segmented Ring Calculator
function calculateSegmented() {
    const segments = parseFloat(document.getElementById('seg-segments').value);
    const diameter = parseFloat(document.getElementById('seg-diameter').value);
    const thickness = parseFloat(document.getElementById('seg-thickness').value);
    
    if (!segments || !diameter || !thickness || segments < 3) {
        showResult('segmented-result', '<p style="color: red;">Please enter valid values (segments must be 3 or more)</p>');
        return;
    }
    
    const miterAngle = 180 / segments;
    const radius = diameter / 2;
    
    // Calculate segment length using chord length formula
    const segmentLength = 2 * radius * Math.sin((Math.PI / segments));
    
    // Calculate segment width at center
    const segmentWidth = segmentLength / 2;
    
    // Inside diameter (accounting for thickness)
    const insideDiameter = diameter - (2 * thickness);
    
    const resultHTML = `
        <h3>Results:</h3>
        <p><strong>Miter Angle:</strong> ${miterAngle.toFixed(2)}° (${(90 - miterAngle).toFixed(2)}° on saw)</p>
        <p><strong>Segment Length:</strong> ${segmentLength.toFixed(3)}"</p>
        <p><strong>Inside Diameter:</strong> ${insideDiameter.toFixed(3)}"</p>
        <p><strong>Segments Needed:</strong> ${segments}</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 0.9rem; color: #666;">Cut ${segments} pieces at ${segmentLength.toFixed(3)}" length with ${(90 - miterAngle).toFixed(2)}° miter cuts</p>
    `;
    
    showResult('segmented-result', resultHTML);
}

// 5. Right Triangle Calculator
function calculateTriangle() {
    const sideA = parseFloat(document.getElementById('tri-side-a').value) || 0;
    const sideB = parseFloat(document.getElementById('tri-side-b').value) || 0;
    const sideC = parseFloat(document.getElementById('tri-side-c').value) || 0;
    const angleA = parseFloat(document.getElementById('tri-angle-a').value) || 0;
    
    let a = sideA, b = sideB, c = sideC;
    let angA = angleA, angB = 0;
    
    // Count how many values we have
    const valuesProvided = [a, b, c, angA].filter(v => v > 0).length;
    
    if (valuesProvided < 2) {
        showResult('triangle-result', '<p style="color: red;">Please enter at least 2 values</p>');
        return;
    }
    
    // Calculate missing values
    if (a && b && !c) {
        c = Math.sqrt(a * a + b * b);
    } else if (a && c && !b) {
        b = Math.sqrt(c * c - a * a);
    } else if (b && c && !a) {
        a = Math.sqrt(c * c - b * b);
    } else if (a && angA && !b && !c) {
        const angARad = angA * (Math.PI / 180);
        angB = 90 - angA;
        b = a * Math.tan(angARad);
        c = a / Math.cos(angARad);
    } else if (b && angA && !a && !c) {
        const angARad = angA * (Math.PI / 180);
        angB = 90 - angA;
        a = b / Math.tan(angARad);
        c = b / Math.sin(angARad);
    } else if (c && angA && !a && !b) {
        const angARad = angA * (Math.PI / 180);
        angB = 90 - angA;
        a = c * Math.cos(angARad);
        b = c * Math.sin(angARad);
    }
    
    // Calculate angles if we don't have them
    if (!angA && a && b) {
        angA = Math.atan(b / a) * (180 / Math.PI);
    }
    if (angA) {
        angB = 90 - angA;
    }
    
    const resultHTML = `
        <h3>Results:</h3>
        <p><strong>Side A (adjacent):</strong> ${a.toFixed(3)}"</p>
        <p><strong>Side B (opposite):</strong> ${b.toFixed(3)}"</p>
        <p><strong>Side C (hypotenuse):</strong> ${c.toFixed(3)}"</p>
        <p><strong>Angle A:</strong> ${angA.toFixed(2)}°</p>
        <p><strong>Angle B:</strong> ${angB.toFixed(2)}°</p>
        <p><strong>Angle C:</strong> 90°</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 0.9rem; color: #666;">Right triangle solved using Pythagorean theorem and trigonometry</p>
    `;
    
    showResult('triangle-result', resultHTML);
}

// 6. Roof Rafter Calculator
function calculateRafter() {
    const run = parseFloat(document.getElementById('rafter-run').value);
    const pitch = parseFloat(document.getElementById('rafter-pitch').value);
    const overhang = parseFloat(document.getElementById('rafter-overhang').value) || 0;
    
    if (!run || !pitch) {
        showResult('rafter-result', '<p style="color: red;">Please enter run and pitch</p>');
        return;
    }
    
    // Convert run to inches
    const runInches = run * 12;
    
    // Calculate rise
    const rise = (pitch / 12) * runInches;
    
    // Calculate rafter length using Pythagorean theorem
    const rafterLength = Math.sqrt((runInches * runInches) + (rise * rise));
    
    // Calculate angle
    const angle = Math.atan(rise / runInches) * (180 / Math.PI);
    
    // Calculate overhang length
    const overhangLength = overhang / Math.cos(angle * (Math.PI / 180));
    
    // Total rafter length
    const totalLength = rafterLength + overhangLength;
    
    const resultHTML = `
        <h3>Results:</h3>
        <p><strong>Rise:</strong> ${(rise / 12).toFixed(2)} feet (${rise.toFixed(2)} inches)</p>
        <p><strong>Rafter Length:</strong> ${(rafterLength / 12).toFixed(2)} feet (${rafterLength.toFixed(2)} inches)</p>
        <p><strong>Overhang Length:</strong> ${overhangLength.toFixed(2)} inches</p>
        <p><strong>Total Rafter Length:</strong> ${(totalLength / 12).toFixed(2)} feet (${totalLength.toFixed(2)} inches)</p>
        <p><strong>Roof Angle:</strong> ${angle.toFixed(2)}°</p>
        <p><strong>Pitch:</strong> ${pitch}:12</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 0.9rem; color: #666;">Based on ${run}' run with ${pitch}:12 pitch and ${overhang}" overhang</p>
    `;
    
    showResult('rafter-result', resultHTML);
}

// Helper function to display results
function showResult(elementId, html) {
    const resultDiv = document.getElementById(elementId);
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}

// Add enter key support for all calculators
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.calc-content input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const calcContent = this.closest('.calc-content');
                const button = calcContent.querySelector('.calc-button');
                if (button) {
                    button.click();
                }
            }
        });
    });
});
