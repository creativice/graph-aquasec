import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { AquaSecAccount } from '../../aquasec/types';

import { Entities } from '../constants';

export function createAccountEntity(data: AquaSecAccount): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: `aquasec_account:${data.id}`,
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        id: data.id.toString(),
        name: data.id.toString(),
        owner: data.root_user,
        createdOn: parseTimePropertyValue(data.created),

        stripeId: data.stripe_id,
        trialEnd: parseTimePropertyValue(data.trial_end),
        currentPlan: data.current_plan,
        additionalCredits: data.additional_credits,
        numAllowedKeys: data.num_allowed_keys,
        suppressionsAdminOnly: data.suppressions_admin_only,
        globalSuppressionsAdminOnly: data.global_suppressions_admin_only,
        source: data.source,
        enforceOauth: data.enforce_oauth,
        usersAdminOnly: data.users_admin_only,
        integrationsAdminOnly: data.integrations_admin_only,
        disableDefaultEmails: data.disable_default_emails,
        blockDefaultGroup: data.block_default_group,
        presuppressPlugins: data.presuppress_plugins,
        associateTags: data.associate_tags,
        awsMarketplaceId: data.aws_marketplace_id,
        cspEnabled: data.csp_enabled,
        rootUser: data.root_user,
      },
    },
  });
}
