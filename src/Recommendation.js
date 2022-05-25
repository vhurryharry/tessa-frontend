import {
  Alert,
  Box,
  Button,
  Card,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MarkdownIt from "markdown-it";
import { useState } from "react";

const md = new MarkdownIt();

const Recommendation = ({
  id: defaultId,
  markdown: defaultMarkdown,
  prompt,
  skillId,
  facetId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(defaultId);
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState();
  const handleSave = () => {
    setIsSaving(true);
    const url = id
      ? `${process.env.REACT_APP_API_ORIGIN}/recommendations/${id}`
      : `${process.env.REACT_APP_API_ORIGIN}/recommendations`;
    const method = id ? "PUT" : "POST";
    const body = id
      ? JSON.stringify({ markdown })
      : JSON.stringify({ markdown, skill_id: skillId, facet_id: facetId });
    fetch(url, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })
      .then((res) => res.json())
      .then(
        ({ data, error }) => {
          if (data) {
            setId(data.id);
          }
          setIsSaving(false);
          setSaveError(error);
          if (!error) {
            setIsEditing(false);
          }
        },
        (error) => {
          setIsSaving(false);
          setSaveError(error);
        }
      );
  };
  return isEditing ? (
    <Box py={3}>
      <TextField
        disabled={isSaving}
        fullWidth
        label={prompt}
        multiline
        rows={10}
        value={markdown}
        onChange={(event) => {
          setMarkdown(event.target.value);
        }}
      />
      {saveError && (
        <Alert
          severity="error"
          variant="outlined"
          onClose={() => setSaveError()}
          sx={{ mt: 1 }}
        >
          {saveError.message}
        </Alert>
      )}
      <Typography
        component="div"
        variant="body2"
        display="flex"
        justifyContent="flex-end"
      >
        <p>
          By clicking "Save", you agree to the{" "}
          <MuiLink href="/privacy-policy/" target="_blank">
            Privacy Policy
          </MuiLink>{" "}
          and{" "}
          <MuiLink href="/terms-of-use/" target="_blank">
            Terms of Use
          </MuiLink>
          .
        </p>
      </Typography>
      <Stack justifyContent="flex-end" direction="row" my={1} spacing={1}>
        <Button
          disabled={isSaving}
          onClick={() => setIsEditing(false)}
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
  ) : id ? (
    <Card
      variant="outlined"
      sx={{
        background: "rgba(0,0,0,0.5)",
        borderColor: "rgba(255,255,255,0.25)",
        px: 3,
        mb: 2,
      }}
    >
      <Typography component="div" mb>
        <div
          dangerouslySetInnerHTML={{
            __html: md.render(markdown),
          }}
        />
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Button onClick={() => setIsEditing(true)} size="small">
          Edit
        </Button>
      </Box>
    </Card>
  ) : (
    <Box py={3}>
      <Button
        variant="outlined"
        onClick={() => setIsEditing(true)}
        size="small"
      >
        Add new recommendation
      </Button>
    </Box>
  );
};

export default Recommendation;