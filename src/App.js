import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.sass";

const query = `query{
  superheroCollection {
    items {
      name
      role
      image {
        url(transform: {height: 300})
        description
      }
    }
  }
}
`;

function App() {
  const [data, setData] = useState(null);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    window
      .fetch(
        "https://graphql.contentful.com/content/v1/spaces/tszb2cmnf03q/?access_token=rHbw0_BJc0INm-yLYKDAfq_u8a4CsQSFasUf4olPHDE",
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
  }, []);
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
            <p class="navbar-item">Super Hero Gifs!</p>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <button onClick={loginWithRedirect}>Log in</button>
            </div>
          </div>
        </div>
      </nav>

      <section class="section">
        <div class="container">
          <div class="columns is-multiline">
            {data.superheroCollection.items.map((item, index) => (
              <div class="column is-narrow" key={index}>
                <div class="card ">
   
                  <div class="card-image">
                    <figure class="image is-centered">
                      <img src={item.image.url} alt={item.image.description} />
                    </figure>
                  </div>
                  <header class="card-header">
                    <p class="card-header-title is-centered ">{item.name}</p>
                  </header>
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
