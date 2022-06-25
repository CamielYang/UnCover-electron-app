const template = document.createElement('template');
template.innerHTML = `
    <div class="template">
        <h1>Template</h1>
    </div>
`;

class Template extends HTMLElement {
    constructor() {
        super()

        this.appendChild(template.content.cloneNode(true));

        this.templateContainer = this.children[0];
    }
}

window.customElements.define('webcomponent-template', Template);
