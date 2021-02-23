export const CreateFolderListMixin = {

    created() {
      this.getFoldersFromVuex()
    },

    data() {
        return {
            Folders: ''
        }
    },

    methods: {
        getFoldersFromVuex() {
            this.$store.dispatch('GetUserFolders').then(() => {
                return this.Folders = this.$store.state.UserFolders
              // console.log(waitForFolders())
              // return store.state.UserFolders
                })
        }
    }



}