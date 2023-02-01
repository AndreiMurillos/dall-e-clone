import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });
  const [loading, setLoading] = useState(false);
  const [generetingImg, setGeneretingImg] = useState(false);

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneretingImg(true);
        const response = await fetch(
          'https://dall-e-clone-32sl.onrender.com/api/v1/dalle',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: form.prompt }),
          }
        );
        const data = await response.json();

        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (error) {
        alert(error);
      } finally {
        setGeneretingImg(false);
      }
    } else {
      alert('Debes ingresar una frase');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);

      try {
        const response = await fetch('http://localhost:8080/api/v1/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        await response.json();
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Debes ingresar una frase y generar una imagen');
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>
          ¡Empieza a crear!
        </h1>
        <p className='mt-2 text-[#666e75] text-[17px] max-w[500px]'>
          Crea increibles imagenes con DALL-E AI y compartelas con tu comunidad
        </p>
      </div>
      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField
            labelName='Tu nombre'
            type='text'
            name='name'
            placeholder='Juan Perez'
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName='Frase'
            type='text'
            name='prompt'
            placeholder='Un perro jugando con una pelota'
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue w-64 p-3 h-64 flex justify-center items-center'>
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.photo}
                className='w-full h-full object-contain'
              />
            ) : (
              <img
                src={preview}
                alt={preview}
                className='w-9/12 h-9/12 object-contain opacity-40'
              />
            )}
            {generetingImg && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className='mt-5 flex gap-5'>
          <button
            type='button'
            onClick={generateImage}
            className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {generetingImg ? 'Generando...' : 'Generar imagen'}
          </button>
        </div>
        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>
            Una vez que hayas creado la imagen que quieres, puedes compartirla
            con mas personas de la comunidad.
          </p>
          <button
            type='submit'
            className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center '
          >
            {' '}
            {loading ? 'Compartiendo...' : 'Compartir'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
