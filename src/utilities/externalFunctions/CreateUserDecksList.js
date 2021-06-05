export async function CreateUserDecksList(storeUserData, firebaseRef, folderID) {
    let mainFolders;
    await firebaseRef.database().ref(`UsersData/${storeUserData}/Folders/` + folderID + '/decks/DecsNames').once('value').then((snapshot) => {
         const data = snapshot.val()
         // console.log(data, 'mounted function')

         let Folders = []
         if (data) {
             Object.keys(data).forEach(key => {
                 Folders.push({
                     id: key,
                     name: data[key].name,
                     length: data[key].length,
                     alphabet: data[key].alphabet
                 })
             })
         }
        mainFolders = Folders
     })
    return mainFolders
}
