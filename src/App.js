import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import "./App.sass";



function App() {
  const [data, setData] = useState(null);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [role, setRole] = useState('Anonymous');

  const query = `query {
  superheroCollection(where: {role_contains_all: ["${role}"]}) {
    items {
      name
      role
      text {
        json
      }
      sys {
        id
        spaceId
      }
      image {
        url(transform: {height: 300})
        description
      }
    }
  }
}
`;

  useEffect(()=> {
    if (user) {
      const roleFromToken = user["http://contentful-demo/roles"][0];
      setRole(roleFromToken);
    }
  }, [user]);


  useEffect(() => {
    window
      .fetch(
        "https://graphql.contentful.com/content/v1/spaces/tszb2cmnf03q/environments/RichText-Practise/?access_token=rHbw0_BJc0INm-yLYKDAfq_u8a4CsQSFasUf4olPHDE",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ query }),
        }
      )
      .then((response) => response.json())
      .then((json) => setData(json.data));
  }, [query, role]);
  if (!data) return <span>Loading :(</span>;
  console.log(data);
  return (
    <div>
      <nav
        class="navbar is-primary"
        role="navigation"
        aria-label="main navigation"
      >
        <div class="navbar-menu">
          <div class="navbar-start">
            {!isAuthenticated && <p class="navbar-item">Super Hero Gifs! Login if you don't want to be {role}.</p> }
            {isAuthenticated && <p class="navbar-item">Hi {user.name}. You are a {role}.</p> }
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              {!isAuthenticated && <button onClick={ loginWithRedirect } >Log in</button> }
              {isAuthenticated && <button onClick={ () => logout({returnTo: window.location.origin }) } >Logout</button> }

            </div>
          </div>
        </div>
      </nav>

      <section class="section">
        <div class="container">
          <div class="columns is-multiline">
            {data.superheroCollection.items.map((item, index) => (
              <div class="column is-one-third" key={index}>
                <div class="card ">
   
                  <div class="card-image">
                    <figure class="image is-centered">
                      <img src={item.image.url} alt={item.image.description} />
                    </figure>
                  </div>
                  <header class="card-header">
                    {role === "Admin" &&
                    <p class="card-header-title is-centered "><a href={"https://app.contentful.com/spaces/" + item.sys.spaceId + "/entries/" +item.sys.id } >{item.name}</a></p>
                    }
                    {role !== "Admin" &&
                    <p class="card-header-title is-centered ">{item.name}</p>
                    }
                  </header>
                  {item.text &&   <div class="card-content"><div class="content">{documentToReactComponents(item.text.json)}</div></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
