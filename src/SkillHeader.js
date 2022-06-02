import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import ClickWrapAgreement from "./ClickWrapAgreement";
import useSession from "./useSession";

const SkillHeader = ({
  id,
  name: defaultName,
  description: defaultDescription,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState();
  const { isAuthor } = useSession();
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);
  const handleSave = () => {
    setIsSaving(true);
    fetch(`${process.env.REACT_APP_API_ORIGIN}/skills/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    })
      .then((res) => res.json())
      .then(
        ({ error }) => {
          setIsSaving(false);
          setError(error);
          if (!error) {
            setIsEditing(false);
          }
        },
        (err) => {
          setError(err);
          setIsSaving(false);
        }
      );
  };
  const handleCancel = () => {
    setName(defaultName);
    setDescription(defaultDescription);
    setIsEditing(false);
  };
  return isEditing ? (
    <Stack spacing={3}>
      <TextField
        fullWidth
        label="Skill name"
        variant="filled"
        disabled={isSaving}
        InputProps={{ style: { fontSize: 22 } }}
        InputLabelProps={{ style: { fontSize: 22 } }}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <TextField
        fullWidth
        label="Short description"
        variant="filled"
        multiline
        rows={2}
        disabled={isSaving}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <Box>
        {error && (
          <Alert severity="error" variant="outlined" onClose={() => setError()}>
            {error.message}
          </Alert>
        )}
        <ClickWrapAgreement buttonLabel="Save" justifyContent="flex-end" />
        <Stack justifyContent="flex-end" direction="row" spacing={1}>
          <Button
            disabled={isSaving}
            onClick={handleCancel}
            variant="outlined"
            size="small"
          >
            Cancel
          </Button>
          <Button
            disabled={isSaving}
            onClick={handleSave}
            variant="contained"
            size="small"
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Stack>
  ) : (
    <Box>
      <Typography component="h1" variant="h3" mb>
        {name}
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: "30em" }}>
        {description}
      </Typography>
      {isAuthor && (
        <Box my={2}>
          <Button onClick={() => setIsEditing(true)} size="small">
            Edit Skill
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SkillHeader;
