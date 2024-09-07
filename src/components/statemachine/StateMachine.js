let idCount = 0

export class StateMachine {
    #id = (++idCount).toString();
    #context;

    #previousState;
    #currentState;
    #isChangingState = false;
    #changeStateQueue = [];

    states = new Map();

    get previousStateName() {
        if(!this.#previousState) return "";
        return this.#previousState.name;
    }

    constructor(context, id){
        this.#context = context;
        this.#id = id ?? this.#id;
    }

    isCurrentState(name){
        if(!this.#currentState) return false;
        return this.#currentState.name === name;
    }

    addState(name, config){
        const context = this.#context;

        this.states.set(name, {
            name,
            onEnter: config?.onEnter?.bind(context),
            onExit: config?.onExit?.bind(context),
            onUpdate: config?.onUpdate?.bind(context),
        });

        return this;
    }

    setState(name){
        if(!this.states.has(name)){
            console.warn(`Tried to change to unknown state: ${name}`);
            return;
        }

        if(this.#isChangingState){
            this.#changeStateQueue.push(name);
            return;
        }

        this.#isChangingState = true;

        // console.log(`Changing state from ${this.#currentState?.name} to ${name}`);

        if(this.#currentState && this.#currentState.onExit){
            this.#currentState.onExit();
        }

        this.#previousState = this.#currentState;
        this.#currentState = this.states.get(name);

        if(this.#currentState.onEnter){
            this.#currentState.onEnter();
        }

        this.#isChangingState = false;
    }

    update(dt){
        if(this.#changeStateQueue.length > 0){
            this.setState(this.#changeStateQueue.shift());
            return;
        }

        if(this.#currentState && this.#currentState.onUpdate){
            this.#currentState.onUpdate(dt);
        }
    }
}