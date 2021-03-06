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

import static org.symphonyoss.integration.parser.ParserUtils.newUri;
import static org.symphonyoss.integration.parser.ParserUtils.presentationFormat;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.ACTION;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.DATA;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.LIST;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.NAME;
import static org.symphonyoss.integration.webhook.trello.TrelloEventConstants.CARD_CREATED;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;
import org.symphonyoss.integration.parser.SafeString;
import org.symphonyoss.integration.webhook.trello.TrelloNotificationConstants;

import java.util.Arrays;
import java.util.List;

/**
 * Specific class to handle card created event from Trello.
 * Created by rsanchez on 09/09/16.
 */
@Component
public class CardCreatedTrelloParser extends CardTrelloParser {

  /**
   * Formatted message expected by user
   */
  public static final String CARD_CREATED_FORMATTED_TEXT = "%s added %s to %s (in %s) (%s)";

  /**
   * Returns the Trello events handled by this parser.
   */
  @Override
  public List<String> getEvents() {
    return Arrays.asList(CARD_CREATED);
  }

  /**
   * Formats the text message for card created event.
   */
  @Override
  protected SafeString createFormattedText(JsonNode payload, JsonNode data, String creatorName,
      String boardName, String shortUrl) {
    final String listName = payload.path(ACTION).path(DATA).path(LIST).path(NAME).asText();
    final String cardName = getSubjectNode(payload).path(NAME).asText();
    return presentationFormat(CARD_CREATED_FORMATTED_TEXT, creatorName, cardName, listName,
        boardName, newUri(shortUrl));
  }

  @Override
  protected String getReceivedNotification(JsonNode payload) {
    return TrelloNotificationConstants.CARD_CREATED;
  }
}
