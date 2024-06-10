import InstructionConfig from "./InstructionConfig.js";

export default class Instruction {
    constructor(name) {
        this.name = name;
        this.config = InstructionConfig.instructions.get(name);

        this.args = [];

        for (let i = 0; i < this.config.args.length; i++) {
            this.args.push(this.config.args[i].defaultValue);
        }
    }

    setAt(i, val) {
        if (!this.config.validate(i, val)) {
            return;
        }

        this.args[i] = val;
    }

    set(name, val) {
        for (let i = 0; i < this.config.args.length; i++) {
            if (this.config.args[i].name === name) {
                if (!this.config.validate(i, val)) {
                    return;
                }

                this.args[i] = val;
                return;
            }
        }
    }

    get convertedArgs() {
        const args = [];

        for (let i = 0; i < this.args.length; i++) {
            args.push(this.config.args[i].conversion(this.args[i]));
        }

        return args;
    }
}