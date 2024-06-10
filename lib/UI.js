import Instruction from "./Instruction.js";
import InstructionConfig from "./InstructionConfig.js";
import Path from "./Path.js";

export const pathsElement = document.querySelector("#paths");

/**
 * @param {Path} path
 */
export function createPathContainer(path) {
    const element = document.createElement("div");
    element.classList.add("path");
    element.id = `path-${path.id}`;

    const buttonsElement = document.createElement("div");
    buttonsElement.classList.add("buttons");

    const addButton = document.createElement("button");
    addButton.innerText = "Add New";
    addButton.addEventListener("click", () => {
        const dropDown = document.createElement("div");
        dropDown.classList.add("selectInstruction");

        InstructionConfig.instructions.forEach(config => {
            const option = document.createElement("option");
            option.innerText = config.name;
            option.value = config.name;

            dropDown.appendChild(option);

            option.addEventListener("click", () => {
                const instruction = new Instruction(config.name);
                path.addInstrution(instruction);
                dropDown.remove();
            });
        });

        document.body.appendChild(dropDown);
    });

    const removeButton = document.createElement("button");
    removeButton.innerText = "Delete Path";
    removeButton.addEventListener("click", () => {
        if (!confirm("Are you sure you want to delete this path?")) {
            return;
        }

        document.getElementById(`path-${path.id}`).remove();
        path.shouldDelete = true;
    });

    buttonsElement.appendChild(addButton);
    buttonsElement.appendChild(removeButton);

    element.appendChild(buttonsElement);

    pathsElement.appendChild(element);

    return element;
}

/**
 * @param {Path} path
 * @param {Instruction} instruction
 */
export function createInstructionElement(path, instruction) {
    const element = document.createElement("div");
    element.classList.add("instruction");
    element.innerText = instruction.name;

    const buttonsElement = document.createElement("div");
    buttonsElement.classList.add("buttons");

    const removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    removeButton.addEventListener("click", () => {
        path.removeInstruction(path.instructions.indexOf(instruction));
        element.remove();
    });

    const upButton = document.createElement("button");
    upButton.innerText = "Move Up";
    upButton.addEventListener("click", () => {
        path.moveInstructionUp(path.instructions.indexOf(instruction));
    });

    const downButton = document.createElement("button");
    downButton.innerText = "Move Down";
    downButton.addEventListener("click", () => {
        path.moveInstructionDown(path.instructions.indexOf(instruction));
    });

    buttonsElement.appendChild(removeButton);
    buttonsElement.appendChild(upButton);
    buttonsElement.appendChild(downButton);

    element.appendChild(buttonsElement);

    const argsElement = document.createElement("div");
    argsElement.classList.add("args");

    for (let i = 0; i < instruction.config.args.length; i++) {
        const arg = instruction.config.args[i];
        const currValue = instruction.args[i];

        const input = document.createElement("input");
        input.classList.add("arg");

        // Tooltip
        input.title = arg.name;
        input.alt = arg.name;

        switch (arg.type) {
            case "number":
                let argString = currValue.toString();

                if (argString.includes(".") && argString.split(".")[1].length > 3) {
                    argString = arg.toFixed(3);
                }

                input.type = "number";
                input.value = Number(argString);
                break;
            case "string":
                input.type = currValue.startsWith("#") ? "color" : "text";
                input.value = currValue;
                break;
            case "boolean":
                input.type = "checkbox";
                input.checked = currValue;
                break;
        }

        input.addEventListener("change", () => {
            let newValue;

            switch (arg.type) {
                case "number":
                    newValue = Number(input.value);
                    break;
                case "string":
                    newValue = input.value;
                    break;
                case "boolean":
                    newValue = input.checked;
                    break;
            }

            instruction.set(arg.name, newValue);
        });

        argsElement.appendChild(input);
    }

    element.appendChild(argsElement);

    return element;
}