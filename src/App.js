import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // Pegando o Featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return (
    <div className='page'>

      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      <section className='lists'>
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito por <strong>Júlio</strong> CEO da <a href='https://janetwork.com.br'><img src='https://marketinganimado.com.br/wp-content/uploads/2023/03/Logo-Janet-50x50-1.jpg.webp' alt='Logo da Janetwork'/> Janetwork.</a>
        <br/>Direitos de imagem para Netflix <br/>
        Dados pegos do site <a href='https://www.themoviedb.org/'>Themoviedb.org</a>
      </footer>
      {movieList.length <= 0 &&
      <div className='loading'>
        <img src='https://i.gifer.com/origin/36/36527397c208b977fa3ef21f68c0f7b2_w200.gif' alt='Carregando...' />
      </div>
      }
    </div>
  );
}