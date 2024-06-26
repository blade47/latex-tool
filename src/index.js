import KaTeX from 'katex';
import 'katex/dist/katex.min.css';

import './index.css';

class LatexTool {
  static get toolbox() {
    return {
      title: 'Equations',
      icon: `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="1280.000000pt" height="1238.000000pt" viewBox="0 0 1280.000000 1238.000000"
 preserveAspectRatio="xMidYMid meet">
<metadata>
Created by potrace 1.15, written by Peter Selinger 2001-2017
</metadata>
<g transform="translate(0.000000,1238.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M5773 12140 c-1790 -34 -2748 -130 -3403 -342 -708 -229 -1072 -593
-1422 -1423 -71 -168 -119 -291 -403 -1045 -60 -157 -154 -400 -210 -540 -98
-243 -102 -255 -81 -261 11 -3 113 -12 225 -19 l204 -13 19 24 c48 61 136 200
238 378 218 379 326 535 494 709 186 193 357 318 591 433 284 138 589 218
1000 260 169 17 650 15 865 -5 96 -9 178 -16 183 -16 14 0 -9 -668 -38 -1095
-126 -1847 -496 -3368 -1125 -4625 -249 -497 -510 -917 -911 -1465 -484 -662
-554 -766 -648 -960 -85 -174 -131 -348 -131 -491 0 -94 27 -287 55 -389 95
-350 313 -638 622 -822 294 -174 620 -234 954 -174 725 128 1165 652 1463
1744 159 581 282 1314 400 2377 89 794 130 1247 311 3375 63 748 136 1587 161
1865 25 278 48 542 51 588 l6 82 1358 0 1359 0 0 -34 c0 -50 -37 -581 -66
-951 -35 -454 -102 -1182 -194 -2115 -102 -1032 -141 -1456 -184 -1970 -115
-1365 -158 -2454 -113 -2805 49 -372 132 -662 273 -944 333 -671 908 -1079
1689 -1197 137 -21 562 -30 707 -15 932 96 1668 715 2127 1789 107 250 214
585 276 865 57 259 105 624 105 799 l0 68 -235 0 -235 0 0 -44 c0 -132 -58
-441 -112 -595 -196 -565 -610 -877 -1228 -926 -94 -7 -294 8 -405 31 -491
101 -809 434 -980 1029 -157 545 -184 1396 -85 2620 26 310 55 624 120 1290
107 1099 145 1536 175 2050 18 315 35 747 35 908 l0 119 1308 -6 c719 -4 1383
-9 1475 -12 l168 -6 -6 794 c-3 436 -8 861 -11 944 l-6 151 -996 6 c-1693 12
-5323 16 -5789 7z"/>
</g>
</svg>`,
    };
  }

  constructor({ data }) {
    this.data = data || {};
    this.data.equations = this.data.equations || [''];
    this.wrapper = undefined;
    this.equationWrappers = [];
  }

  render() {
    this.wrapper = document.createElement('div');

    this.output = document.createElement('div');
    this.output.id = 'output-latex-tool';
    this.wrapper.appendChild(this.output);

    const addButton = document.createElement('button');
    addButton.innerText = 'Add Equation';
    addButton.classList.add('add-equation-button-latex-tool');
    addButton.addEventListener('click', (e) => this.addEquation(e));
    this.wrapper.appendChild(addButton);

    this.equationContainer = document.createElement('div');
    this.wrapper.appendChild(this.equationContainer);

    this.data.equations.forEach((equation, index) => {
      const eqWrapper = this.createEquationWrapper(equation, index);
      this.equationContainer.appendChild(eqWrapper);
      this.equationWrappers.push(eqWrapper);
    });

    this.renderLatex();

    return this.wrapper;
  }

  createEquationWrapper(equation, index) {
    const eqWrapper = document.createElement('div');
    eqWrapper.classList.add('equation-wrapper-latex-tool');

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Write LaTeX code here...';
    textarea.value = equation;
    textarea.classList.add('equation-textarea-latex-tool');
    textarea.dataset.index = index;
    textarea.addEventListener('input', (event) => {
      this.data.equations[event.target.dataset.index] = event.target.value;
      this.renderLatex();
    });

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Remove';
    removeButton.classList.add('remove-equation-button-latex-tool');
    removeButton.dataset.index = index;
    removeButton.addEventListener('click', (event) => {
      this.removeEquation(event.target.dataset.index);
    });

    eqWrapper.appendChild(textarea);
    eqWrapper.appendChild(removeButton);

    return eqWrapper;
  }

  addEquation(e) {
    e.preventDefault();

    this.data.equations.push('');
    const newIndex = this.data.equations.length - 1;
    const newEqWrapper = this.createEquationWrapper('', newIndex);
    this.equationContainer.appendChild(newEqWrapper);
    this.equationWrappers.push(newEqWrapper);
    this.updateEquationWrappersIndices();
    this.renderLatex();
  }

  removeEquation(index) {
    this.data.equations.splice(index, 1);
    this.equationWrappers.forEach((wrapper) => wrapper.remove());
    this.equationWrappers = [];
    this.equationContainer.innerHTML = '';
    this.data.equations.forEach((equation, index) => {
      const eqWrapper = this.createEquationWrapper(equation, index);
      this.equationContainer.appendChild(eqWrapper);
      this.equationWrappers.push(eqWrapper);
    });
    this.updateEquationWrappersIndices();
    this.renderLatex();
  }

  updateEquationWrappersIndices() {
    this.equationWrappers.forEach((wrapper, index) => {
      const textarea = wrapper.querySelector('textarea');
      const removeButton = wrapper.querySelector('button.remove-equation-button-latex-tool');
      textarea.dataset.index = index;
      removeButton.dataset.index = index;
    });
  }

  renderLatex() {
    const equations = this.data.equations.map((eq) => eq.trim()).filter((eq) => eq.length > 0);
    if (equations.length === 0) {
      this.output.textContent = ''; // Clear the output if there are no equations
      return;
    }
    const systemOfEquations =
      equations.length > 1
        ? `\\left\\{ \\begin{aligned} ${equations.join(' \\\\ ')} \\end{aligned} \\right.`
        : `\\begin{aligned} ${equations[0]} \\end{aligned}`;

    try {
      KaTeX.render(systemOfEquations, this.output, {
        throwOnError: false,
      });
    } catch (error) {
      this.output.textContent = error.message;
    }
  }

  save(blockContent) {
    return {
      equations: this.data.equations,
    };
  }
}

export default LatexTool;
