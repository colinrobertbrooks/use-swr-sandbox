import { useRouter } from "next/router";
import useSWR, { SWRConfig } from "swr";

const usePokemon = (slug: string) => {
  const { isLoading, error, data } = useSWR(
    `https://pokeapi.co/api/v2/pokemon/${slug}`,
    (input: string) => fetch(input).then((res) => res.json()),
    {
      dedupingInterval: 3600000, // 1 hour
    }
  );
  return {
    isLoading,
    isError: error,
    pokemon: data,
  };
};

const Pokemon = ({ slug }: { slug: string }) => {
  const { isLoading, isError, pokemon } = usePokemon(slug);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error!</p>;
  return <img src={pokemon.sprites.front_default} alt={pokemon.name} />;
};

const HomePage = () => {
  const router = useRouter();
  const selectedPokemon = router.query.pokemon;

  return (
    <SWRConfig>
      <main>
        <h1>Pokémon</h1>
        <div>
          <label htmlFor="pokemon-select">Select a Pokémon</label>{" "}
          <select
            id="pokemon-select"
            value={selectedPokemon ?? ""}
            onChange={(event) =>
              router.push(`/?pokemon=${event.target.value}`, undefined, {
                shallow: true,
              })
            }
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="pikachu">Pikachu</option>
            <option value="charmander">Charmander</option>
            <option value="bulbasaur">Bulbasaur</option>
          </select>
        </div>
        {typeof selectedPokemon === "string" && (
          <Pokemon slug={selectedPokemon} />
        )}
      </main>
    </SWRConfig>
  );
};

export default HomePage;
