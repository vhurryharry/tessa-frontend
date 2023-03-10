import {
  Alert,
  AlertTitle,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Grid,
  Link as MuiLink,
  Skeleton,
  Typography,
} from "@mui/material";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import Page from "./Page";
import { fetchSkills } from "./api";
import useSession from "./useSession";

const SkillsPage = () => {
  const { isAuthor } = useSession();
  const {
    data: skills,
    isError,
    isLoading,
    isSuccess,
  } = useQuery("skills", fetchSkills);
  return (
    <Page>
      <Container>
        <Box mt={3} mb={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} underline="hover" color="inherit" to="/">
              TESSA
            </MuiLink>
            <Typography color="text.primary">Skills</Typography>
          </Breadcrumbs>
        </Box>
        <Typography component="h1" variant="h3" mb>
          Skills
        </Typography>
        <Typography component="p" variant="body1" sx={{ maxWidth: "30em" }}>
          This page lists all of the essential skills that have been documented
          in TESSA.
        </Typography>
        <Grid container spacing={2} sx={{ my: 3 }}>
          {isLoading && (
            <Fragment>
              <Grid item xs={12} md={6} lg={4}>
                <Skeleton height={220} variant="rectangular" />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Skeleton height={220} variant="rectangular" />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Skeleton height={220} variant="rectangular" />
              </Grid>
            </Fragment>
          )}
          {isError && (
            <Grid item xs={12} sm={6}>
              <Alert severity="error" variant="outlined">
                <AlertTitle>Failed to fetch skills list</AlertTitle>
                <p>
                  A problem occurred when trying to fetch the list of skills.
                  You can refresh the page to try again.
                </p>
              </Alert>
            </Grid>
          )}
          {isSuccess &&
            skills.map((skill) => (
              <Grid item key={skill.id} xs={12} md={6} lg={4}>
                <Card variant="outlined" sx={{ p: 3 }}>
                  <Typography
                    component="h2"
                    variant="h6"
                    lineHeight={1.25}
                    mb
                    minHeight="2.5em"
                  >
                    <MuiLink
                      component={Link}
                      to={`/skills/${skill.id}/`}
                      underline="none"
                      color="inherit"
                    >
                      {skill.name}
                    </MuiLink>
                  </Typography>
                  <Typography
                    variant="body2"
                    mb={3}
                    lineHeight={1.5}
                    minHeight="4.5em"
                  >
                    {skill.description}
                  </Typography>
                  <Typography variant="button">
                    <MuiLink
                      component={Link}
                      to={`/skills/${skill.id}/`}
                      underline="none"
                    >
                      View skill
                    </MuiLink>
                  </Typography>
                </Card>
              </Grid>
            ))}
          {isAuthor && (
            <Grid item xs={12} md={6} lg={4}>
              <Box display="flex" justifyContent="center">
                <Button
                  component={Link}
                  to="/new-skill/"
                  variant="contained"
                  sx={{ my: 11.5 }}
                >
                  + Add New Skill
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Page>
  );
};

export default SkillsPage;
