import {md5_password,getDataFromDoc} from './checking.js'
export async function login(_username,_password){
    let datas=await firebase.firestore().collection('User').where("userName","==",_username).get();
    
    if (datas.empty==false) {
        let isPassword= await firebase.firestore().collection('User').where("userName","==",_username).where("passWords","==",md5_password(_password)).get();
       
        if (isPassword.empty==false) {
           
            let userID = isPassword.docs[0].id
            let token = generateToken(userID)
            localStorage.setItem("token",token);
            await updateAccount(userID,{'token':token})
            router.navigate('/home')
        }else{
            alert("Wrong password.");
        }
    }else{
        alert("Wrong username.");
    }
}
export async function register(_name,_username,_password,errorFuction){
    let datas=await firebase.firestore().collection('User').where("userName","==",_username).get();
    if (datas.empty) {
        await firebase.firestore().collection('User').add({
            name:_name,
            userName:_username,
            passWords:md5_password(_password),
            token: ""
        })
        router.navigate("/login");
        alert("Register successfully!")
    }else{
        errorFuction();
    }
}

export async function updateAccount(id,data){
    firebase.firestore().collection("User").doc(id).update(data);
}
export async function getUserByToken(token){
    let response = await firebase.firestore().collection("User").where("token","==",token).get();

    return getDataFromDoc(response.docs[0])
}

export function generateToken(id){
    return md5_password(Date.now()+id);
}