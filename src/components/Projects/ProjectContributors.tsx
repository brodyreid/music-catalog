import Modal from '@/components/shared/Modal.tsx';
import useFetchData from '@/hooks/useFetchData.tsx';
import Cross from '@/icons/Cross.tsx';
import Plus from '@/icons/Plus.tsx';
import { ProjectActions, ProjectState } from '@/reducers/projectReducer.ts';
import { Contributor } from '@/types/index.ts';
import { Dispatch, useState } from 'react';

interface ProjectContributorsProps {
  state: ProjectState;
  dispatch: Dispatch<ProjectActions>;
}

export default function ProjectContributors({ state, dispatch }: ProjectContributorsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: contributors } = useFetchData<Contributor>('http://localhost:3000/contributors');

  function handleAddContributor(contributor: Contributor) {
    dispatch({ type: 'added_contributor', contributor });
    setIsModalOpen(false);
  }

  function handleRemoveContributor(contributorId: string) {
    dispatch({ type: 'removed_contributor', contributorId });
  }

  return (
    <>
      <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} dimensions={{ w: 80, h: 64 }}>
        <div>
          <ul className='space-y-2'>
            {contributors.map((c) => (
              <li key={c.id}>
                <button className='font-bold text-accent hover' onClick={() => handleAddContributor(c)}>
                  {c.first_name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
      <ul className='rounded-sm p-2 bg-primary text-secondary space-y-2'>
        {state.contributors?.map((c) => (
          <li key={c.id} className='flex items-center justify-between'>
            <div className='font-bold text-accent'>{c.first_name}</div>
            <button onClick={() => handleRemoveContributor(c.id)}>
              <Cross className='w-4' />
            </button>
          </li>
        ))}
        <li className='text-sm'>
          <button type='button' className='bg-transparent text-stone-500 hover ring-0 border-none outline-hidden' onClick={() => setIsModalOpen(true)}>
            <div className='flex items-center'>
              <Plus className='w-4 mr-1' />
              add contributor
            </div>
          </button>
        </li>
      </ul>
    </>
  );
}
