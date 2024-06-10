class ArgConfig {
    name = "";
    type = "";
    defaultValue = null;
    conversion = val => val;

    constructor(name, type, defaultValue = null, conversion = v => v) {
        this.name = name;
        this.type = type;

        if (defaultValue !== null) {
            this.defaultValue = defaultValue;
        } else {
            switch (type) {
                case "number":
                    this.defaultValue = 0;
                    break;
                case "boolean":
                    this.defaultValue = false;
                    break;
                case "color":
                    this.defaultValue = "#000000";
                    break;
                default:
                    this.defaultValue = null;
                    break;
            }
        }

        this.conversion = conversion;
    }
}

class InstructionConfig {
    static idAccumulator = 0;

    /**
     * @type {Map<string, InstructionConfig>}
     */
    static instructions = new Map();

    /**
     * @param {number} id
     * @returns {InstructionConfig}
     */
    static getByID(id) {
        for (const [$, config] of InstructionConfig.instructions) {
            if (config.id === id) {
                return config;
            }
        }

        return null;
    }
    
    constructor(name) {
        this.name = name;
        this.id = InstructionConfig.idAccumulator++;
        
        /**
         * @type {ArgConfig[]}
         */
        this.args = [];

        InstructionConfig.instructions.set(this.name, this);
    }

    /**
     * @param {ArgConfig} arg 
     */
    addArg(arg) {
        this.args.push(arg);
        return this;
    }

    validate(index, value) {
        const arg = this.args[index];

        switch (arg.type) {
            case "number":
                return typeof value === "number";
            case "boolean":
                return typeof value === "boolean";
            case "string":
                return /^#[0-9a-f]{6}$/i.test(value);
            default:
                return false;
        }
    }
}

function degreeesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

new InstructionConfig("moveTo")
    .addArg(new ArgConfig("x", "number"))
    .addArg(new ArgConfig("y", "number"));

new InstructionConfig("lineTo")
    .addArg(new ArgConfig("x", "number"))
    .addArg(new ArgConfig("y", "number"));

new InstructionConfig("arc")
    .addArg(new ArgConfig("x", "number"))
    .addArg(new ArgConfig("y", "number"))
    .addArg(new ArgConfig("radius", "number"))
    .addArg(new ArgConfig("startAngle", "number", 0, degreeesToRadians))
    .addArg(new ArgConfig("endAngle", "number", 0, degreeesToRadians))
    .addArg(new ArgConfig("anticlockwise", "boolean", false));

new InstructionConfig("arcTo")
    .addArg(new ArgConfig("x1", "number"))
    .addArg(new ArgConfig("y1", "number"))
    .addArg(new ArgConfig("x2", "number"))
    .addArg(new ArgConfig("y2", "number"))
    .addArg(new ArgConfig("radius", "number"));

new InstructionConfig("bezierCurveTo")
    .addArg(new ArgConfig("cp1x", "number"))
    .addArg(new ArgConfig("cp1y", "number"))
    .addArg(new ArgConfig("cp2x", "number"))
    .addArg(new ArgConfig("cp2y", "number"))
    .addArg(new ArgConfig("x", "number"))
    .addArg(new ArgConfig("y", "number"));

new InstructionConfig("quadraticCurveTo")
    .addArg(new ArgConfig("cpx", "number"))
    .addArg(new ArgConfig("cpy", "number"))
    .addArg(new ArgConfig("x", "number"))
    .addArg(new ArgConfig("y", "number"));

new InstructionConfig("rect")
    .addArg(new ArgConfig("x", "number"))
    .addArg(new ArgConfig("y", "number"))
    .addArg(new ArgConfig("width", "number"))
    .addArg(new ArgConfig("height", "number"));

new InstructionConfig("ellipse")
    .addArg(new ArgConfig("x", "number"))
    .addArg(new ArgConfig("y", "number"))
    .addArg(new ArgConfig("radiusX", "number"))
    .addArg(new ArgConfig("radiusY", "number"))
    .addArg(new ArgConfig("rotation", "number", 0, degreeesToRadians))
    .addArg(new ArgConfig("startAngle", "number", 0, degreeesToRadians))
    .addArg(new ArgConfig("endAngle", "number", 0, degreeesToRadians))
    .addArg(new ArgConfig("anticlockwise", "boolean", false));

new InstructionConfig("closePath");

new InstructionConfig("fill")
    .addArg(new ArgConfig("color", "string", "#000000"));

new InstructionConfig("stroke")
    .addArg(new ArgConfig("color", "string", "#000000"))
    .addArg(new ArgConfig("lineWidth", "number"));

export default InstructionConfig;