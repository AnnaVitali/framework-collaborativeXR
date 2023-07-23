/**
 * Utility class used to check if elements exist.
 */
class ElementChecker{
    /**
     * Empty constructor of the class.
     */
    constructor(){
        this.elementNames = [];
    }

    /**
     * Verify if the element specified exist in the scene.
     * @param name {String} the name of the element
     * @returns {boolean} return true of the element exist false otherwise.
     */
    verifyNameAlreadyExist(name){
        if(this.elementNames.includes(name)){
            return true;
        }else{
            this.elementNames.push(name);
            return false;
        }
    }
} 

const elementChecker = new ElementChecker();

export {elementChecker}