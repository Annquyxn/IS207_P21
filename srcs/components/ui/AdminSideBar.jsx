import styled from 'styled-components';
import AdminNav from './adminNav';

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 20px 16px;
  border-right: 1px solid var(--color-grey-100);

  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

function AdminSideBar() {
  return (
    <StyledSidebar>
      <AdminNav />
    </StyledSidebar>
  );
}

export default AdminSideBar;
