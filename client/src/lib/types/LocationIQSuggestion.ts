export type LocationIQSuggestion =  {
    place_id: string
    osm_id: string
    osm_type: string
    licence: string
    lat: string
    lon: string
    boundingbox: string[]
    class: string
    type: string
    display_name: string
    display_place: string
    display_address: string
    address: LocationIQAddress
  }
  
  export type LocationIQAddress =  {
    town: string | undefined
    village: string | undefined
    name: string
    neighbourhood?: string
    city?: string
    county?: string
    state?: string
    postcode?: string
    country: string
    country_code: string
    suburb?: string
    road?: string
  }