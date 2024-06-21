import KaTeX from 'katex';
import 'katex/dist/katex.min.css';

import './index.css';

class LatexTool {
  static get toolbox() {
    return {
      title: 'Equations',
      icon: `<svg width="24" height="24" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
               <rect width="100%" height="100%" fill="white" />
               <text x="10" y="30" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="black">Equation</text>
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
    this.output.id = 'output';
    this.wrapper.appendChild(this.output);

    const addButton = document.createElement('button');
    addButton.innerText = 'Add Equation';
    addButton.classList.add('add-equation-button');
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
    eqWrapper.classList.add('equation-wrapper');

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Write LaTeX code here...';
    textarea.value = equation;
    textarea.classList.add('equation-textarea');
    textarea.dataset.index = index;
    textarea.addEventListener('input', (event) => {
      this.data.equations[event.target.dataset.index] = event.target.value;
      this.renderLatex();
    });

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Remove';
    removeButton.classList.add('remove-equation-button');
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
      const removeButton = wrapper.querySelector('button.remove-equation-button');
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
        ? `\\left\\{ \\begin{array}{l} ${equations.join(' \\\\[1ex] ')} \\end{array} \\right.`
        : equations[0];

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
