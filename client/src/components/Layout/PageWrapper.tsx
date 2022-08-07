import React from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
};
const PageWrapper: React.FC<Props> = ({ children }) => {
  return (
    <Box w="100%" p={5}>
      <SimpleGrid columns={[2, 3, 4]} spacing="40px">
        {children}
      </SimpleGrid>
    </Box>
  );
};
export default PageWrapper;
