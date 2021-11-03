import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';

import { useAppContext } from '../hooks';
import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';

const Edit = ({ name, label }) => {
  const { profile, setProfile } = useAppContext();

  const [disabled, setDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      [name]: profile[name] || '',
    },
    validationSchema: yup.object({
      [name]: yup.string().required(`${label} is required`),
    }),
    onSubmit: async (values) => {
      setDisabled(true);

      // if no change.
      if (values[name] !== formik.initialValues[name]) {
        setSubmitting(true);

        const _profile = { ...profile, [name]: values[name] };
        const ceramic = await Utils.getInstance(Ceramic);
        await ceramic.updateProfile(_profile);
        setProfile((_profile));

        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  return (
    <FormControl variant="standard" fullWidth error={formik.touched[name] && Boolean(formik.errors[name])}>
      <InputLabel shrink>{label}</InputLabel>
      <Input
        name={name}
        value={formik.values[name]}
        onChange={(e) => {
          formik.setFieldTouched(name);
          formik.handleChange(e);
        }}
        onBlur={formik.handleSubmit}
        disabled={disabled}
        disableUnderline={disabled}
        autoComplete='off'
        endAdornment={(
          <InputAdornment position="end">
            {submitting ? (
              <CircularProgress color="secondary" size={25} />
            ) : disabled ? (
              <Tooltip title="Edit" placement="top" arrow>
                <IconButton color="primary" onClick={() => setDisabled(false)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            ) : !(formik.touched[name] && formik.errors[name]) ? (
              <Tooltip title="Save" placement="top" arrow>
                <IconButton
                  color="primary"
                  onClick={formik.handleSubmit}
                >
                  <CheckIcon />
                </IconButton>
              </Tooltip>
            ) : null}
          </InputAdornment>
        )}
      />
      <FormHelperText>{formik.touched[name] && formik.errors[name]}</FormHelperText>
    </FormControl>
  )
}

export default Edit;
