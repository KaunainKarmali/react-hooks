// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useState, useEffect} from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {ErrorBoundary as ErrorBoundaryExternal} from "react-error-boundary";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, pokemonName: '' };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, pokemonName: error.message};
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="pokemon-info">
          <h3>There was an error:</h3>
          <p>Unsupported pokemon: "{this.state.pokemonName}".</p>
          <p>Try "pikachu"</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

const statuses = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
}

function ErrorFallback({error}) {
  return (
    <div className="pokemon-info">
      <h3>There was an error:</h3>
      <p>Unsupported pokemon: "{error.message}".</p>
      <p>Try "pikachu"</p>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = useState({
    pokemon: null,
    error: null,
    status: statuses.idle,
  });

  useEffect(() => {
    if (!pokemonName || state.status === statuses.pending) {
      return;
    }

    setState({
      ...state,
      pokemon: null,
      error: null,
      status: statuses.pending,
    })

    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({
          ...state,
          pokemon,
          error: null,
          status: statuses.resolved,
        })
      })
      .catch(error => {
        setState({
          ...state,
          pokemon: null,
          error,
          status: statuses.rejected,
        })
      })
  }, [pokemonName])

  if (state.status  === statuses.resolved) {
    return <PokemonDataView pokemon={state.pokemon} />
  } else if (state.status === statuses.rejected) {
    throw new Error(pokemonName);
  } else if (state.status === statuses.pending) {
    return <PokemonInfoFallback name={pokemonName} />
  }

  return 'Submit a pokemon'
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <ErrorBoundaryExternal
        FallbackComponent={ErrorFallback}
        resetKeys={[pokemonName]}
      >
        <div className="pokemon-info">
          <PokemonInfo pokemonName={pokemonName} />
        </div>
      </ErrorBoundaryExternal>
    </div>
  )
}

export default App
