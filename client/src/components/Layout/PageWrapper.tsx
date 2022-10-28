import { Box, SimpleGrid } from '@chakra-ui/react';
import React from 'react';

type Props = {
  children: React.ReactNode;
};
const PageWrapper: React.FC<Props> = ({ children }) => {
  return (
    <Box w="100%" p={5}>
      <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing="40px">
        {children}
      </SimpleGrid>
    </Box>
  );
};
export default PageWrapper;
