// Install these dependencies:
// npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

import React, { useState, useEffect } from "react";
import Bot from "../Chatobot/Bot";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Chip,
  Paper,
  Container,
  Grid,
  styled,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Book,
  Link as LinkIcon,
  EmojiEvents,
  Lock,
  LocationOn,
  Flag,
  AutoAwesome,
  Close,
} from "@mui/icons-material";

// API Configuration
const API_URL = "http://localhost:5000/api";

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
}));

const ResourceItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(1),
  cursor: "pointer",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.01)",
  },
}));

// Components
const CreateRoadmapCard = ({ onCreateRoadmap, loading }) => {
  const [topic, setTopic] = useState("");

  const handleSubmit = async () => {
    if (!topic.trim()) return;
    await onCreateRoadmap(topic);
    setTopic("");
  };

  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Flag sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h5" component="h2">
            Create Learning Quest
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Learning Adventure Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          margin="normal"
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !topic.trim()}
          startIcon={loading ? <AutoAwesome /> : <AutoAwesome />}
          sx={{ mt: 2 }}
        >
          {loading ? "Crafting Quest..." : "Forge Learning Path"}
        </Button>
      </CardContent>
    </StyledCard>
  );
};

const RoadmapsList = ({ roadmaps, onSelect }) => (
  <StyledCard>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <LocationOn sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h5" component="h2">
          Your Learning Quests
        </Typography>
      </Box>
      <List>
        {roadmaps?.map((roadmap) => (
          <ListItem
            key={roadmap?._id}
            onClick={() => onSelect(roadmap)}
            sx={{
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              borderRadius: 1,
              mb: 1,
            }}
          >
            <Box width="100%">
              <Typography variant="h6" gutterBottom>
                {roadmap?.mainTopic}
              </Typography>
              <ProgressBar
                variant="determinate"
                value={roadmap?.totalProgress ?? 0}
              />
            </Box>
          </ListItem>
        ))}
      </List>
    </CardContent>
  </StyledCard>
);

const CheckpointDialog = ({
  checkpoint,
  open,
  onClose,
  onStatusUpdate,
  roadmapId,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{checkpoint?.title}</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent>
      <Typography paragraph>{checkpoint?.description}</Typography>
      <Typography variant="h6" gutterBottom>
        Resources
      </Typography>
      {checkpoint?.resources?.map((resource) => (
        <ResourceItem key={resource?._id} elevation={1}>
          <a
            href={resource?.url}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Box display="flex" alignItems="center">
              {resource?.type === "video" ? (
                <Book color="error" />
              ) : (
                <LinkIcon color="primary" />
              )}
              <Typography sx={{ ml: 1 }}>{resource?.name}</Typography>
            </Box>
            <Chip label={resource?.type} size="small" />
          </a>
        </ResourceItem>
      ))}
    </DialogContent>
    <Bot
      context={`Checkpoint: ${checkpoint?.title}. Description: ${checkpoint?.description}`}
    />

    <DialogActions>
      <Button
        fullWidth
        variant="contained"
        color={checkpoint?.status === "completed" ? "error" : "success"}
        onClick={() => {
          onStatusUpdate(
            roadmapId,
            checkpoint?._id,
            checkpoint?.status === "completed" ? "not_started" : "completed"
          );
          onClose();
        }}
        startIcon={
          checkpoint?.status === "completed" ? <Cancel /> : <CheckCircle />
        }
      >
        {checkpoint?.status === "completed"
          ? "Reset Progress"
          : "Complete Checkpoint"}
      </Button>
    </DialogActions>
  </Dialog>
);

const RoadmapDialog = ({ roadmap, open, onClose, onCheckpointClick }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <EmojiEvents sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6">{roadmap?.mainTopic}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent>
      <Typography paragraph>{roadmap?.description}</Typography>
      <List>
        {roadmap?.checkpoints?.map((checkpoint, index) => (
          <ListItem
            key={checkpoint?._id}
            onClick={() => onCheckpointClick(checkpoint)}
            sx={{
              cursor: "pointer",
              bgcolor:
                checkpoint?.status === "completed"
                  ? "success.light"
                  : "grey.50",
              borderRadius: 1,
              mb: 1,
              "&:hover": {
                bgcolor:
                  checkpoint?.status === "completed"
                    ? "success.light"
                    : "grey.100",
              },
            }}
          >
            <Box width="100%">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle1">
                  Checkpoint {index + 1}: {checkpoint?.title}
                </Typography>
                {checkpoint?.status === "completed" ? (
                  <CheckCircle color="success" />
                ) : (
                  <Lock color="action" />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {checkpoint?.description}
              </Typography>
              <Chip
                label={`${checkpoint?.totalHoursNeeded} hrs`}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </ListItem>
        ))}
      </List>
    </DialogContent>
  </Dialog>
);

const RoadmapPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [loading, setLoading] = useState(false);

  const createRoadmap = async (topic) => {
    setLoading(true);
    try {
      const data = await fetchWithAuth("/roadmaps/create", {
        method: "POST",
        body: JSON.stringify({ topic }),
      });
      setRoadmaps((prev) => [...prev, data]);
      setSelectedRoadmap(data?.roadmap);
    } catch (error) {
      console.error("Failed to create roadmap:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCheckpointStatus = async (roadmapId, checkpointId, status) => {
    try {
      const updatedRoadmap = await fetchWithAuth(
        "/roadmaps/update-checkpoint-status",
        {
          method: "POST",
          body: JSON.stringify({ roadmapId, checkpointId, status }),
        }
      );
      setRoadmaps((prev) =>
        prev.map((rm) => (rm?._id === roadmapId ? updatedRoadmap : rm))
      );
      setSelectedRoadmap(updatedRoadmap);
    } catch (error) {
      console.error("Failed to update checkpoint:", error);
    }
  };

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const data = await fetchWithAuth("/roadmaps/");
        setRoadmaps(data);
      } catch (error) {
        console.error("Failed to fetch roadmaps:", error);
      }
    };
    fetchRoadmaps();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CreateRoadmapCard
            onCreateRoadmap={createRoadmap}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RoadmapsList roadmaps={roadmaps} onSelect={setSelectedRoadmap} />
        </Grid>
      </Grid>

      <RoadmapDialog
        roadmap={selectedRoadmap}
        open={!!selectedRoadmap}
        onClose={() => setSelectedRoadmap(null)}
        onCheckpointClick={setSelectedCheckpoint}
      />

      <CheckpointDialog
        checkpoint={selectedCheckpoint}
        open={!!selectedCheckpoint}
        onClose={() => setSelectedCheckpoint(null)}
        onStatusUpdate={updateCheckpointStatus}
        roadmapId={selectedRoadmap?._id}
      />
    </Container>
  );
};

export default RoadmapPage;
