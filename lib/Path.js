import Instruction from "./Instruction.js";
import InstructionConfig from "./InstructionConfig.js";
import { createInstructionElement, createPathContainer, pathsElement } from "./UI.js";

export default class Path {
    static idAccumulator = 0;

    static fromSaveData(data) {
        const path = new Path();

        while (data.length > 0) {
            const config = InstructionConfig.getByID(data.shift());

            if (config == null) {
                throw new Error("Invalid instruction ID");
            }

            const instruction = new Instruction(config.name);

            for (let i = 0; i < config.args.length; i++) {
                const val = data.shift();

                if (!config.validate(i, val)) {
                    instruction.setAt(i, config.args[i].defaultValue);
                } else {
                    instruction.setAt(i, val);
                }
            }

            path.instructions.push(instruction);
        }

        return path;
    }

    constructor() {
        this.id = Path.idAccumulator++;

        /**
         * @type {Instruction[]}
         */
        this.instructions = [];

        this.shouldDelete = false;
        this.variables = new Map();
    }

    /**
     * @param {Instruction} instruction 
     */
    addInstrution(instruction) {
        this.instructions.push(instruction);

        const element = createInstructionElement(this, instruction);
        document.getElementById(`path-${this.id}`).appendChild(element);

        if (instruction.name === "variable") {
            this.variables.set(instruction.args[0], instruction.args[1]);
        }

        return this;
    }

    /**
     * @param {number} i 
     * @param {Instruction} instruction 
     */
    insertInstruction(i, instruction) {
        this.instructions.splice(i, 0, instruction);
        this.redoInstructionElements();
        return this;
    }

    /**
     * @param {number} i 
     */
    removeInstruction(i) {
        this.instructions.splice(i, 1);
        return this;
    }

    moveInstructionUp(i) {
        if (i === 0) {
            return;
        }

        const instruction = this.instructions[i];
        const prevInstruction = this.instructions[i - 1];

        this.instructions[i] = prevInstruction;
        this.instructions[i - 1] = instruction;

        console.log(this.instructions);

        this.redoInstructionElements();
    }

    moveInstructionDown(i) {
        if (i === this.instructions.length - 1) {
            return;
        }

        const instruction = this.instructions[i];
        const nextInstruction = this.instructions[i + 1];

        this.instructions[i] = nextInstruction;
        this.instructions[i + 1] = instruction;

        console.log(this.instructions);

        this.redoInstructionElements();
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.save();
        ctx.beginPath();

        for (const instruction of this.instructions) {
            const convertedArgs = instruction.convertedArgs;
            switch (instruction.name) {
                case "variable":
                    break;
                case "fill":
                    ctx.fillStyle = convertedArgs[0];
                    ctx.fill();
                    break;
                case "stroke":
                    ctx.strokeStyle = convertedArgs[0];
                    ctx.lineWidth = convertedArgs[1];
                    ctx.stroke();
                    break;
                case "globalAlpha":
                    ctx.globalAlpha = convertedArgs[0];
                    break;
                default:
                    ctx[instruction.name](...convertedArgs);
                    break;
            }
        }

        ctx.restore();
    }

    getSaveData() {
        const output = [];

        for (const instruction of this.instructions) {
            output.push(instruction.config.id);
            output.push(...instruction.args);
        }

        return output;
    }

    initUI() {
        const container = createPathContainer(this);
        pathsElement.appendChild(container);

        this.redoInstructionElements();
    }

    redoInstructionElements() {
        const container = document.getElementById(`path-${this.id}`);

        while (container.children.length > 1) {
            container.children.item(1).remove();
        }

        let i = 1;
        for (const instruction of this.instructions) {
            const element = createInstructionElement(this, instruction);
            container.appendChild(element);
        }
    }
}