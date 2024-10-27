import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { SortPipe } from '../sort.pipe';
import * as bootstrap from 'bootstrap';

interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // List of all Pokémon
  pokemons = [{ name: '' }];

  // Pagination controls
  p: number = 1;
  itemsPerPage: number = 10;
  count: number = 1;

  // Input for filtering Pokémon by name
  pokemonName: string = '';

  // Pokémon details to display on selection
  pokemonData = {
    name: '',
    base_experience: 0,
    height: 0,
    id: -1,
    location_area_encounters: '',
    weight: '',
    stats: [] as Stat[],
  };

  // Sprites (images) for the selected Pokémon
  sprites = {
    back_default: '',
    back_female: '',
    back_shiny: '',
    back_shiny_female: '',
    front_default: '',
    front_female: '',
    front_shiny: '',
    front_shiny_female: '',
  };

  // List of abilities for the selected Pokémon
  pokemonAbilities = [{ ability: { name: '' } }];

  // List of types for the selected Pokémon
  types: string[] = [];

  // Location area encounters data
  pokemonLocationAreaEncounters = [{ location_area: { name: '' } }];

  // Sorting control
  sortBy = 'name';
  sortDirection = '';
  sortPipe: SortPipe;

  constructor(private apiService: ApiService) {
    this.sortPipe = new SortPipe();
  }

  // Called when the component is initialized
  ngOnInit(): void {
    this.getAllPokemons();
  }

  // Set sorting direction to ascending
  sortDirectionAsc() {
    this.sortDirection = 'asc';
  }

  // Set sorting direction to descending
  sortDirectionDesc() {
    this.sortDirection = 'desc';
  }

  // Filter the Pokémon list by name
  filterByName() {
    console.log(this.pokemonName);
    if (this.pokemonName !== '') {
      this.pokemons = this.pokemons.filter((res) =>
        res.name.toLowerCase().includes(this.pokemonName.toLowerCase())
      );
    } else {
      this.getAllPokemons(); // Reload all Pokémon if the filter is cleared
    }
  }

  // Fetch all Pokémon data from the API
  getAllPokemons() {
    this.apiService.getData().subscribe(
      (data) => {
        this.pokemons = data.results;
        console.log('All Pokémon:', data);
      },
      (error) => {
        console.error('Error fetching Pokémon list:', error);
      }
    );
  }

  // Show detailed data for the selected Pokémon
  showPokemon(event: any, pokemonName: string) {
    console.log('Event ID:', event.target.id);
    console.log('Selected Pokémon:', pokemonName);

    // Fetch Pokémon details
    this.apiService.getPokemon(pokemonName).subscribe(
      (data) => {
        this.pokemonData = data;
        this.sprites = data.sprites;
        this.pokemonAbilities = data.abilities;

        // Extract and store the types
        this.types = data.types.map((typeObj: any) => typeObj.type.name);

        console.log('Pokemon Data:', this.pokemonData);
        console.log('Abilities:', this.pokemonAbilities);
        console.log('Types:', this.types);
      },
      (error) => {
        console.error('Error fetching Pokémon details:', error);
      }
    );

    // Fetch location area encounters
    this.apiService.getLocationAreaEncounters(pokemonName).subscribe(
      (data) => {
        this.pokemonLocationAreaEncounters = data;
        console.log(
          'Location Area Encounters:',
          this.pokemonLocationAreaEncounters
        );
      },
      (error) => {
        console.error('Error fetching location area encounters:', error);
      }
    );
  }

  // Get a specific stat by name
  getStat(statName: string): number {
    const stat = this.pokemonData.stats.find(
      (stat) => stat.stat.name === statName
    );
    return stat ? stat.base_stat : 0;
  }
}
