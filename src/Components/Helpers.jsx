
export const GetDog = async id => {
  let url = 'https://api.thedogapi.com/v1/breeds/' + id;
  let res;
  let data = [];
  try{
  res = await fetch(url);
  data = await res.json().catch(err => console.log(err));
  }
  catch(ex){
    console.log(ex);
  }
  return data;
};

export const FindDogs = async value => {
  let url = 'https://dogapi.dog/api/v2/breeds/search?q=' + value;
  let res;
  let data = [];
  let tempdata = [];
  try {
  res = await fetch(url);
  tempdata = await res.json().catch(err => console.log(err));
  data = tempdata.data;
  }
  catch(ex){
    console.log(ex);
  }
  return data;
};

export const InsertComment = () => 
  {
  const url = 'https://reqres.in/api/posts';
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      //body: JSON.stringify({ title: 'Manzana' })
      body: JSON.stringify({"name": "manzana turquoise", "year": 2022, "color": "#53B0AE"})
      //
  };
  fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => console.log(data.id));
  };


  export const ListAll = async () => {
    const url = 'https://dogapi.dog/api/v2/breeds';
    let data = [];
    let tempdata = [];
    let response;
    try{
    response = await fetch(url);
    tempdata = await response.json().catch(err => console.log(err));
    data = tempdata.data;
    }
    catch(ex){
      console.log(ex);
    }
    return data;
  };


  