import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _baseUrl = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'bbf946431a91e246cc9f73e8920d7991';
    const _baseOffset = 210;
    
    const getCharacterByName = async (name) => {
        console.log(name);
		const res = await request(`${_baseUrl}characters?name=${name}&apikey=${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	};

    const getAllCharacters = async (offset = _baseOffset) => {
        const result = await request(`${_baseUrl}characters?limit=9&offset=${offset}&apikey=${_apiKey}`);
        return result.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id) => {
        const result = await request(`${_baseUrl}characters/${id}?apikey=${_apiKey}`);
        return _transformCharacter(result.data.results[0]);
    };

    const getAllComics = async (offset = _baseOffset) => {
        const result = await request(`${_baseUrl}comics?limit=8&offset=${offset}&apikey=${_apiKey}`);
        return result.data.results.map(_transformComics);
    };

    const getComic = async (id) => {
        const result = await request(`${_baseUrl}comics/${id}?apikey=${_apiKey}`);
        return _transformComics(result.data.results[0]);
    };

    const _transformCharacter = (char) => {   
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 190)}...` : `Данные о персонаже пока отсутствуют`,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,        
        };        
    };

    const _transformComics = (comics) => {
        return {
            id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount ? `${comics.pageCount} p.` : "No information about the number of pages",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
			price: comics.prices[0].price ? `${comics.prices[0].price}$` : "not available",
        };
    };

    return {loading, error, getAllCharacters, getCharacter, getAllComics, getCharacterByName, getComic, clearError};
}

export default useMarvelService;