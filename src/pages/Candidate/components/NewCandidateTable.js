import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { filter, get } from 'lodash'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import { lighten, makeStyles } from '@material-ui/core/styles';

import { useRecoilState, useRecoilValue } from 'recoil'
import { currentUserAtom } from '../../../recoil/atoms'

import { CSVLink, CSVDownload } from "react-csv";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip
} from "@material-ui/core";
import {
	formatDate,
	renderWithLoader,
	titleGenerator,
} from '../../../utils/helperFunctions'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';

import Search from '../../../components/Search'

function createData(code, candidateName, resumeTitle, contactNumber, email, workExp, annualSalary, currentLocation, preferredLocation, currentEmployer, designation, UGCourse, PGCourse, PostPGCourse, DOB, postalAddress, resumeID, LastActive, commentOne, commentTwo, commentThree, commentFour, commentFive) {
  return { code, candidateName, resumeTitle, contactNumber, email, workExp, annualSalary, currentLocation, preferredLocation, currentEmployer, designation, UGCourse, PGCourse, PostPGCourse, DOB, postalAddress, resumeID, LastActive, commentOne, commentTwo, commentThree, commentFour, commentFive};
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'candidateName', numeric: false, disablePadding: true, label: 'candidate name' },
  { id: 'resumeTitle', numeric: false, disablePadding: true, label: 'resume title' },
  { id: 'contactNumber', numeric: false, disablePadding: true, label: 'contact no' },
  { id: 'email', numeric: false, disablePadding: true, label: 'email' },
  { id: 'workExp', numeric: false, disablePadding: true, label: 'work exp' },
  { id: 'annualSalary', numeric: false, disablePadding: true, label: 'annual salary' },
  { id: 'currentLocation', numeric: false, disablePadding: true, label: 'current location' },
  { id: 'preferredLocation', numeric: false, disablePadding: true, label: 'preferred location' },
  { id: 'currentEmployer', numeric: false, disablePadding: true, label: 'current employer' },
  { id: 'designation', numeric: false, disablePadding: true, label: 'designation' },
  { id: 'UGCourse', numeric: false, disablePadding: true, label: 'u.g. course' },
  { id: 'PGCourse', numeric: false, disablePadding: true, label: 'p.g. course' },
  { id: 'postPGCourse', numeric: false, disablePadding: true, label: 'post p.g. course' },
  { id: 'DOB', numeric: false, disablePadding: true, label: 'age/DOB' },
  { id: 'postalAddress', numeric: false, disablePadding: true, label: 'postal address' },
  { id: 'resumeId', numeric: false, disablePadding: true, label: 'resume id'},
  { id: 'lastActiveDate', numeric: false, disablePadding: true, label: 'Last Active' },
  { id: 'commentOne', numeric: false, disablePadding: true, label: 'comment 1' },
  { id: 'commentTwo', numeric: false, disablePadding: true, label: 'comment 2' },
  { id: 'commentThree', numeric: false, disablePadding: true, label: 'comment 3' },
  { id: 'commentFour', numeric: false, disablePadding: true, label: 'comment 4' },
  { id: 'commentFive', numeric: false, disablePadding: true, label: 'comment 5' },
];


function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
        //     padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <b>{headCell.label.toUpperCase()}</b>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
    fontWeight: 'bold'
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, jobData, setFilterData, rows } = props;
  const currentUser = useRecoilValue(currentUserAtom)
  const history = useHistory()
  const location = useLocation().pathname
  
  const onSearchChange = (e) => {
		var inputVal = e.target.value
		var filterData = jobData.filter(data => {
                        return data['candidateName'].toLowerCase().includes(inputVal) ||
                                data['email'].toLowerCase().includes(inputVal) ||
                                data['currentLocation'].toLowerCase().includes(inputVal) ||
                                data['preferredLocation'].toLowerCase().includes(inputVal) ||
                                data['designation'].toLowerCase().includes(inputVal) ||
                                data['currentEmployer'].toLowerCase().includes(inputVal)
		});
		setFilterData(filterData);
	}

  return (
    <>
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography style={{textAlign: 'left', flex: 'none'}} className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography style={{textAlign: 'left', flex: 'none'}} className={classes.title} variant="h6" id="tableTitle" component="div">
          Candidates
        </Typography>
      )}

      {/* search */}
      <div style={{margin: '0 auto'}}>
        <Search onChange={(e) => {onSearchChange(e)} } />
      </div>


      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon onClick={() => console.log('delete button click')} />
          </IconButton>
        </Tooltip>
      ) : (
        <>
        {get(currentUser, 'roleId.permissions.job.create') && (
							<Tooltip title="Add Job">
              <IconButton aria-label="add job" onClick={() => history.push(`${location}/add`)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
						)}
            <CSVLink data={rows} headers={headCells.label} filename={"candidates.csv"}>
              <Tooltip title="Download">
                <IconButton aria-label="download">
                  <GetAppIcon />
                </IconButton>
              </Tooltip>
            </CSVLink>
          </>
        
      )}
    </Toolbar>
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable({filterData,setFilterData, jobData, toApply}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('postedOn');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const location = useLocation().pathname
  const rows = [];

  filterData.map(candidate => {
        rows.push(
                createData(candidate._id, candidate['candidateName'], candidate['resumeTitle'], candidate['contactNo'], candidate['email'], candidate['workExp'], candidate['annualSalary'], candidate['currentLocation'], candidate['preferredLocation'], candidate['currentEmployer'], candidate['designation'], candidate['UGCourse'], candidate['PGCourse'], candidate['postPGCourse'], candidate['DOB'], candidate['postalAddress'], candidate['resumeId'],  candidate['lastActiveDate'], candidate['commentOne'], candidate['commentOne'], candidate['commentTwo'], candidate['commentThree'],  candidate['commentFour'], candidate['commentFive'])
        );
        console.log(rows)
  })

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.code);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, code) => {
    const selectedIndex = selected.indexOf(code);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, code);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (code) => selected.indexOf(code) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} jobData={jobData} setFilterData={setFilterData} rows={rows} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy} 
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.code);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.code)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.code}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" style={{minWidth: 180}}>
                      {toApply ? (
                          row.candidateName
                        ) : (
                          <NavLink to={`${location}/${row.code}`}>
                            {row.candidateName}
                          </NavLink>
                        )}

                      </TableCell>
                      <TableCell style={{minWidth: 300}}>{row.resumeTitle}</TableCell>
                      <TableCell style={{minWidth: 150}}>
                              <a href={"tel:"+row.contactNumber}>{row.contactNumber}</a>
                        </TableCell>
                      <TableCell>
                              <a href={"mailto:"+row.email} target="_blank">{row.email}</a>
                        </TableCell>
                      <TableCell style={{minWidth: 120}}>{row.workExp}</TableCell>
                      <TableCell style={{minWidth: 150}}>{row.annualSalary}</TableCell>
                      <TableCell style={{minWidth: 180}}>{row.currentLocation}</TableCell>
                      <TableCell style={{minWidth: 200}}>{row.preferredLocation}</TableCell>
                      <TableCell style={{minWidth: 180}}>{row.currentEmployer}</TableCell>
                      <TableCell>{row.designation}</TableCell>
                      <TableCell style={{minWidth: 130}}>{row.UGCourse}</TableCell>
                      <TableCell style={{minWidth: 120}}>{row.PGCourse}</TableCell>
                      <TableCell style={{minWidth: 170}}>{row.PostPGCourse}</TableCell>
                      <TableCell style={{minWidth: 150}}>{row.DOB}</TableCell>
                      <TableCell style={{minWidth: 200}}>{row.postalAddress}</TableCell>
                      <TableCell>
                                {toApply ? (
                                        row.code
                                        ) : (
                                        <NavLink to={`${location}/${row.code}`}>
                                        {row.resumeID}
                                        </NavLink>
                                )}
                      </TableCell>
                      <TableCell style={{minWidth: 150}}>{row.LastActive}</TableCell>
                      <TableCell style={{minWidth: 150}}>{row.commentOne}</TableCell>
                      <TableCell style={{minWidth: 150}}>{row.commentTwo}</TableCell>
                      <TableCell style={{minWidth: 150}}>{row.commentThree}</TableCell>
                      <TableCell style={{minWidth: 150}}>{row.commentFour}</TableCell>
                      <TableCell style={{minWidth: 150}}>{row.commentFive}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={23} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
