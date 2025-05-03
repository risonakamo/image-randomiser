import Store from "electron-store";

const store=new Store<RandomiserStore>({
    defaults:{
        sessions:[],
    },
});

/** get current sessions */
export function getSessions():RandomisationSession[]
{
    return store.store.sessions;
}

export function addSession(session:RandomisationSession):void
{

}