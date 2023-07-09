class ElementChecker{
    constructor(){
        this.elementNames = [];
    }

    verifyNameAlreadyExist(name){
        if(this.elementNames.includes(name)){
            return true;
        }else{
            this.elementNames.push(name);
            return false;
        }
    }
}

export {ElementChecker}