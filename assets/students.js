async function loadStudents() {

    const { data, error } = await window.supabaseClient
        .from("students")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    data.forEach(student => {

        table.innerHTML += `

<tr>

<td>${student.id}</td>

<td>${student.full_name}</td>

<td>${student.father_name}</td>

<td>${student.mother_name}</td>

<td>${student.mobile}</td>

<td>${student.class}</td>

<td>${student.address}</td>

</tr> 

`;

    });

}

loadStudents();
