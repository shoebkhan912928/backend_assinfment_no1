
var express = require('express');//here import express funstion
var app = express();
const storage = require('node-persist');

app.use(express.json());


storage.init();//storage initilize

// here start post requst to find tha all student data which is store node persist
app.get("/allStudents", async (req, res) => {
    const resp = await storage.values();

    let myResp = `<h1 style="color:darkviolet;font-size:45px">All student data!</h1>`;
    for (let u of resp) {

        myResp += `
                <h2 style="color:deeppink">Student ID: ${u.student_id}</h2>
                <h3 style="color:lawngreen">Student Name: ${u.student_name}</h4>
                <h3 style="color:blue">Student GPA: ${u.GPA}</h4>`
    }
    res.send(myResp);

});
// Here we use path variable to find one by one student data through student id
app.get('/student/:student_id', async (req, res) => {
    const student_id = req.params.student_id;
    const resp = await storage.getItem(req.params.student_id);
    if (resp) {
        res.send(`<h1 style="color:darkviolet;font-size:45px">Student Deatil!</h1>
            <h2 style="color:deeppink">Student_ID: ${resp.student_id}</h2>
            <h3 style="color:lawngreen">Student_Name : ${resp.student_name}</h4>
            <h3 style="color:blue">Student_GPA : ${resp.GPA}</h4>`);
    } else {

        res.send("No user avalaible in ths id")
    }


});
// Here are astart to compare all student data to find the greatest GPA 
app.get("/topper", async (req, res) => {
    const students = await storage.values();
    let topper = null;

    for (let student of students) {
        if (!topper || student.GPA > topper.GPA) {
            topper = student;
        }
    }

    if (topper) {
        res.send(`
            <h1 style="color:darkviolet;font-size:45px">Topper</h1>
            <h2 style="color:deeppink">Student ID: ${topper.student_id}</h2>
            <h2 style="color:lawngreen">Student Name: ${topper.student_name}</h2>
            <h2 style="color:blue">Student GPA: ${topper.GPA}</h2>
        `);
    } else {
        res.send("No topper found.");
    }
});

// Here are start to add the student data with the help of post request 
app.post("/student", async (req, res) => {
    const { student_id, student_name, GPA } = req.body;
    const resp = storage.setItem(student_id, { student_id, student_name, GPA });
    res.send({ message: "Added Student successfully ", resp });
});


app.listen(3000, () => {
    console.log("Server has started !");
}); 
