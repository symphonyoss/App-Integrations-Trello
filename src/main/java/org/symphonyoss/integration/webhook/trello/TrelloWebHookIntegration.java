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

package org.symphonyoss.integration.webhook.trello;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.symphonyoss.integration.model.config.IntegrationInstance;
import org.symphonyoss.integration.model.config.IntegrationSettings;
import org.symphonyoss.integration.model.message.Message;
import org.symphonyoss.integration.webhook.WebHookIntegration;
import org.symphonyoss.integration.webhook.WebHookPayload;
import org.symphonyoss.integration.webhook.exception.WebHookParseException;
import org.symphonyoss.integration.webhook.trello.parser.NullTrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.TrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.TrelloParserException;

import javax.annotation.PostConstruct;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.ACTION;
import static org.symphonyoss.integration.webhook.trello.TrelloEntityConstants.TYPE;

/**
 * Implementation of a WebHook to integrate with Trello.
 *
 * Created by rsanchez on 24/08/16.
 */
@Component
public class TrelloWebHookIntegration extends WebHookIntegration {

  private ObjectMapper mapper = new ObjectMapper();

  private Map<String, TrelloParser> parsers = new HashMap<>();

  @Autowired
  private NullTrelloParser defaultTrelloParser;

  @Autowired
  private List<TrelloParser> trelloParserBeans;

  /**
   * Setup parsers.
   */
  @PostConstruct
  public void init() {
    for (TrelloParser parser : trelloParserBeans) {
      List<String> events = parser.getEvents();
      for (String eventType : events) {
        this.parsers.put(eventType, parser);
      }
    }
  }

  @Override
  public void onConfigChange(IntegrationSettings settings) {
    super.onConfigChange(settings);

    String trelloUser = settings.getType();
    for (TrelloParser parser : parsers.values()) {
      parser.setTrelloUser(trelloUser);
    }
  }

  /**
   * The parser method for the incoming Trello payload.
   * @param instance Configuration instance.
   * @param input Incoming Trello payload.
   * @return The messageML resulting from the incoming payload parser.
   * @throws WebHookParseException when any exception occurs when parsing the payload.
   */
  @Override
  public Message parse(IntegrationInstance instance, WebHookPayload input)
      throws WebHookParseException {
    try {
      JsonNode rootNode = mapper.readTree(input.getBody());
      String webHookEvent = rootNode.path(ACTION).path(TYPE).asText();

      TrelloParser parser = getParser(webHookEvent);

      if (parser.filterNotifications(instance, rootNode)) {
        String formattedMessage = parser.parse(instance, rootNode);
        return buildMessageML(formattedMessage, webHookEvent);
      }
    } catch (IOException e) {
      throw new TrelloParserException("Something went wrong while trying to convert your message to the expected format", e);
    }
    return null;
  }

  /**
   * Get the Trello Parser based on the event.
   * @param webHookEvent Event received
   * @return Specific trello parser to handle the event or a default parser if no specific parser
   * found
   */
  private TrelloParser getParser(String webHookEvent) {
    TrelloParser result = parsers.get(webHookEvent);

    if (result == null) {
      return defaultTrelloParser;
    }

    return result;
  }

  /**
   * @see WebHookIntegration#getSupportedContentTypes()
   */
  @Override
  public List<MediaType> getSupportedContentTypes() {
    List<MediaType> supportedContentTypes = new ArrayList<>();
    supportedContentTypes.add(MediaType.WILDCARD_TYPE);
    return supportedContentTypes;
  }
}
