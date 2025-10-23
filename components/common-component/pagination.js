import * as React from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationControlled({setPage,page, last_page}) { 

    const handlePaginateChange = (event, value) => {
        setPage(value);
      };

      
  return (
    <div className='my-3 mb-5'>
      <Pagination count={last_page} page={page} onChange={handlePaginateChange} />
    </div>
  );
}
