import { createThirdwebClient } from 'thirdweb';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const {
  siteConfig: {customFields},
} = useDocusaurusContext();

export default client = createThirdwebClient({ clientId: customFields.THIRDWEB_CLIENT_ID });
