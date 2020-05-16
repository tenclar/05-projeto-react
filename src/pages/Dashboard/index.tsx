import React, { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';
import logImg from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');

  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem(
      '@GithubExplorer:repositories',
    );
    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@GithunExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleAdRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!newRepo) {
      setInputError('Digite o autor / nome do repositório');
      return;
    }
    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch {
      setInputError('Erro na busca por esse repositório');
    }
  }
  return (
    <>
      <img src={logImg} alt="github Explorer" />

      <Title>Explore repositórios no github</Title>

      <Form hasError={!!inputError} onSubmit={handleAdRepository}>
        <input
          placeholder="Digite aqui "
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
        />
        <button type="submit"> pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((rep) => (
          <Link key={rep.full_name} to={`/repositories/${rep.full_name}`}>
            <img src={rep.owner.avatar_url} alt={rep.owner.login} />
            <div>
              <strong>{rep.full_name}</strong>
              <p>{rep.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
