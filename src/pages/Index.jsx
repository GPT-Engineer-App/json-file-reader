import React, { useState, useEffect } from "react";
import { Box, Button, Container, Heading, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Text, useDisclosure, VStack } from "@chakra-ui/react";

const Index = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [projects, setProjects] = useState([]);
  const [edits, setEdits] = useState([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetch(`/api/projects/${selectedProject}/edits`)
        .then((response) => response.json())
        .then((data) => setEdits(data))
        .catch((error) => console.error("Error fetching edits:", error));
    } else {
      setEdits([]);
    }
  }, [selectedProject]);

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    setSelectedEdit(null);
  };

  const handleEditChange = (e) => {
    setSelectedEdit(e.target.value);
  };

  const openModal = () => {
    onOpen();
  };

  const closeModal = () => {
    onClose();
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={8}>Project Edit Viewer</Heading>
      <Select placeholder="Select a project" mb={4} onChange={handleProjectChange}>
        {projects.map((project) => (
          <option key={project} value={project}>
            {project}
          </option>
        ))}
      </Select>
      {selectedProject && (
        <Select placeholder="Select an edit" mb={8} onChange={handleEditChange}>
          {edits.map((edit) => (
            <option key={edit.id} value={edit.id}>
              {edit.id}
            </option>
          ))}
        </Select>
      )}
      {selectedEdit && (
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Prompt:
          </Text>
          <Text mb={8}>{edits.find((edit) => edit.id === selectedEdit)?.prompt}</Text>
          <Button onClick={openModal} mb={8}>
            View Code Changes
          </Button>
          <Modal isOpen={isOpen} onClose={closeModal} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Code Changes</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {edits
                  .find((edit) => edit.id === selectedEdit)
                  ?.code_blocks?.map((block, index) => (
                    <Box key={index} mb={4}>
                      <Text fontWeight="bold">{block.path}</Text>
                      <pre>{block.content}</pre>
                    </Box>
                  ))}
              </ModalBody>
            </ModalContent>
          </Modal>
          <VStack spacing={8}>
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Before:
              </Text>
              <Image src={edits.find((edit) => edit.id === selectedEdit)?.screenshot_url} alt="Before" />
            </Box>
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                After:
              </Text>
              <Image src={edits.find((edit) => edit.id === selectedEdit)?.screenshot_url} alt="After" />
            </Box>
          </VStack>
        </Box>
      )}
    </Container>
  );
};

export default Index;
