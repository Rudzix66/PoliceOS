function deleteFines(id) {
  get(
    "/usersInfo",
    {
      name: "fines",
      id: id,
    },
    "json"
  ).then((data) => {
    for (const fines of data) {
      post("/usersInfo", {
        action: "delete",
        view: "fines",
        id: fines.id,
      });
    }
  });
}

export default deleteFines;