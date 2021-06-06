export default async function getUserFolders(userData, firebase) {
    let Folder;
    await firebase.database().ref(`UsersData/${userData}/Folders`).once('value').then((snapshot) => {
        const data = snapshot.val();
        let Folders = [];
         if (data) {
             Object.keys(data).forEach(key => {
                 Folders.push({
                     id: key,
                     name: data[key].name,
                     // decs: data[key].decs
                 })
             })
         }
        console.log(Folders)
        Folder = Folders
     })
    return Folder
}