function addStudent(){
    alert("Student added successfully");
    return;
}
function addFaculty(){
    alert("Faculty added successfully");
    return;
}
function removeStudent(){
    const confirm = document.getElementById('floatingInput').value;
    // console.log(confirm);
    // if(confirm == 'CONFIRM'){
        alert("Student removed successfully");
        return;
    // }
    // else{
        // alert("Please type 'CONFIRM' to delete this student profile");
        // return;
    // }
}
function removeFaculty(){
    const confirm = document.getElementById('floatingInput').value;
    // console.log(confirm);
    // if(confirm == "CONFIRM"){
        alert("Faculty removed successfully");
        return;
    // }
    // else{
        // alert("Please type 'CONFIRM' to delete this faculty profile");
        // return;
    // }
}