import React from 'react';
import { useState, useEffect } from 'react';
import { Loader, FormField, Card } from '../components';

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className='mt-5 font-bold text-[#6449ff] text-xl uppercase'>{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          'https://dall-e-clone-32sl.onrender.com/api/v1/posts',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (res.ok) {
          const result = await res.json();
          setAllPosts(result.data.reverse());
        }
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );

        setSearchResults(searchResults);
      }, 500)
    );
  };

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>
          ¡Lo que la comunidad quiere que veas!
        </h1>
        <p className='mt-2 text-[#666e75] text-[17px] max-w[500px]'>
          Explora entre las multiples colecciones de imagenes increibles
          generadas por DALL-E AI
        </p>
      </div>
      <div className='mt-16'>
        <FormField
          labelName='Search posts'
          type='text'
          name='text'
          placeholder='Search posts'
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>
      <div className='mt-10'>
        {loading ? (
          <div className='flex justify-center items-center'>
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className='font-medium text-[#666e75] text-xl mb-3'>
                Resultados para{' '}
                <span className='text-[#222328]'>{searchText}</span>
              </h2>
            )}
            <div className='grid lg:grid-cols-4 sm:-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
              {searchText ? (
                <RenderCards
                  data={searchResults}
                  title='No se encontraron resultados'
                />
              ) : (
                <RenderCards data={allPosts} title='No hay posts' />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
