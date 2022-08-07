import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { RoutePaths } from "@/types";
import { Link } from "react-router-dom";

type NavbarProps = {
  account: string | null;
  owner: string;
  web3Handler: () => void;
};

type NavLinks = {
  path: RoutePaths;
  name: string;
};
const Navbar: React.FC<NavbarProps> = ({ web3Handler, account, owner }) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const RouteItems: NavLinks[] = [
    {
      name: "Home",
      path: RoutePaths.HOME,
    },
    // {
    //   name: "Create",
    //   path: RoutePaths.CREATE,
    // },
    {
      name: "My Listings",
      path: RoutePaths.MY_LISTINGS,
    },
    {
      name: "My Purchases",
      path: RoutePaths.MY_PURCHASES,
    },
  ];

  if (account?.toLowerCase() === owner.toLowerCase()) {
    RouteItems.splice(1, 0, {
      name: "Create",
      path: RoutePaths.CREATE,
    });
  }
  return (
    <Box as="section" pb={{ base: "12", md: "24" }}>
      <Box
        as="nav"
        bg="bg-surface"
        boxShadow={useColorModeValue("sm", "sm-dark")}
      >
        <Container py={{ base: "4", lg: "5" }}>
          <HStack spacing="10" justify="space-between">
            {/*<Logo />*/}
            {isDesktop ? (
              <Flex justify="space-between" flex="1">
                <ButtonGroup variant="link" spacing="8">
                  {account ? (
                    RouteItems.map((item) => {
                      return (
                        <Button key={item.name}>
                          <Link to={item.path}>{item.name}</Link>
                        </Button>
                      );
                    })
                  ) : (
                    <Button key={RouteItems[0].name}>
                      <Link to={RouteItems[0].path}>{RouteItems[0].name}</Link>
                    </Button>
                  )}
                </ButtonGroup>
                <HStack spacing="3">
                  {/*<Button variant="ghost">Go To Meta!</Button>*/}
                  {account ? (
                    <Text maxWidth={20} noOfLines={1}>
                      {account}
                    </Text>
                  ) : (
                    <Button
                      onClick={web3Handler}
                      colorScheme="teal"
                      variant="outline"
                    >
                      Go To Meta!
                    </Button>
                  )}
                </HStack>
              </Flex>
            ) : (
              <IconButton
                variant="ghost"
                icon={<FiMenu fontSize="1.25rem" />}
                aria-label="Open Menu"
              />
            )}
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Navbar;
