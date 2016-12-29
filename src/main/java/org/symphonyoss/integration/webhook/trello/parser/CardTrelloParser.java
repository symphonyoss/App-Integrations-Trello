/**
 * Copyright 2016-2017 Symphony Integrations - Symphony LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.symphonyoss.integration.webhook.trello.parser;

import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.ACTION;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.CARD_TYPE;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.DATA;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.LIST;

import com.fasterxml.jackson.databind.JsonNode;
import org.symphonyoss.integration.entity.EntityBuilder;
import org.symphonyoss.integration.webhook.trello.model.TrelloCard;
import org.symphonyoss.integration.webhook.trello.model.TrelloList;

/**
 * Base class for parsers related to card events sent by Trello Webhook.
 * Created by rsanchez on 08/09/16.
 */
public abstract class CardTrelloParser extends BaseTrelloParser {


  /**
   * Includes the card and list (if any) as a nested entities of data entity.
   */
  @Override
  protected void augmentEventAndDataWithEventEntities(EntityBuilder eventBuilder, EntityBuilder dataBuilder,
      JsonNode payload, JsonNode data) {
    if (data.has(LIST)) {
      final TrelloList list = new TrelloList(data.path(LIST));
      dataBuilder.nestedEntity(list.toEntity());
    }

    final TrelloCard card = new TrelloCard(getSubjectNode(payload));
    dataBuilder.nestedEntity(card.toEntity());
  }

  /**
   * Returns the subject for card events parsers.
   * @return Card node from Trello payload.
   */
  @Override
  protected JsonNode getSubjectNode(JsonNode payload) {
    return payload.path(ACTION).path(DATA).path(CARD_TYPE);
  }

}
