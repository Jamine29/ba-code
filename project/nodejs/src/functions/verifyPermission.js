function verifyPermission(book, authDataId) {
    if(book.owner.toString() === authDataId) {
        return true;
    }
    else if(book.manager.includes(authDataId)) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = verifyPermission;